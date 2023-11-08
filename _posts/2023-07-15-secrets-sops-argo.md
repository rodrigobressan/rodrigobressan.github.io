---
layout: post
title: "Managing K8S secrets with ArgoCD and SOPS"
date: 2023-05-15 09:00:00 -0500
categories: [cloud, k8s]
tags: [cloud, k8s, argocd, sops]
image:
  path: /assets/img/posts/10-secrets/banner.jpeg
---


ArgoCD is a popular tool for managing Kubernetes resources, providing a declarative way to define and maintain the desired state of your applications running in a Kubernetes cluster. One essential aspect of deploying applications securely is managing secrets. Kubernetes provides the concept of secrets, but handling them effectively within ArgoCD can be a challenge. This is where Ksops comes to the rescue. In this blog post, we will explore how to use Ksops to manage secrets in ArgoCD, ensuring a more secure and efficient deployment process.

## Understanding ArgoCD Secrets

Before diving into the details of Ksops, let's briefly understand how ArgoCD manages secrets. ArgoCD uses a GitOps approach, storing application configurations in a Git repository. While application manifests can be version-controlled and audited, secrets require extra care due to their sensitive nature.

ArgoCD offers several options for managing secrets:

1. **Git-Secrets**: Secrets can be stored in a Git repository, encrypted using `sops` or a similar tool. However, this may not be the most secure option, as it still exposes secrets to anyone with access to the repository.

2. **External Secret Management**: You can use an external secret management tool such as HashiCorp Vault, Kubernetes secrets, or a cloud provider's secret manager. While this approach provides better security, it can be more complex to set up and manage.

## Enter Ksops

Ksops (Kustomize-SOPS) is a powerful tool designed to simplify and secure the management of secrets in Kubernetes, especially in GitOps workflows like ArgoCD. Ksops takes a declarative approach to secret management, allowing you to store encrypted secrets alongside your application manifests in the same Git repository. It offers the following benefits:

1. **Zero Trust Secrets**: With Ksops, secrets are stored in the same Git repository as your application manifests, but they are securely encrypted. This means you don't have to rely on the secrecy of your Git repository, following the "Zero Trust" principle.

2. **Ease of Use**: Ksops integrates seamlessly with ArgoCD and other GitOps tools, making it easy to incorporate into your existing workflow.

3. **Strong Encryption**: Ksops uses strong encryption algorithms to protect your secrets, ensuring they remain confidential.

4. **Audit Trail**: Since secrets are version-controlled in the Git repository, you can maintain a clear audit trail of who made changes to the secrets.

# Installing SOPS

In order to install SOPS, make sure you have `pip` installed on your environment, and then download the SOPS package with:

```shell
$ pip install sops
```

# Configuring SOPS (Secrets Manager)

Now that we have SOPS installed on our machine, let's look on how to configure it to use our personal GPG keys

## Generate GPG Keys

```shell
$ export GPG_NAME="k3s.argotest.cluster"

$ export GPG_COMMENT="argocd secrets"

$ gpg --batch --full-generate-key <<EOF
%no-protection
Key-Type: 1
Key-Length: 4096
Subkey-Type: 1
Subkey-Length: 4096
Expire-Date: 0
Name-Comment: ${GPG_COMMENT}
Name-Real: ${GPG_NAME}
EOF
```
With the following command, we create a new GPG key of 4096 bytes, and add a comment and name to it (in order to be able to distinguish it easily from others)


### Retrieve key name

```shell
$ gpg --list-secret-keys "${GPG_NAME}"
```

This command will output you the ID of your GPG key, which will be used from now on to identiy your GPG key.

### Store the GPG key fingerprint as an environment variable

```shell
$ export GPG_ID=<OUTPUT_FROM_PREVIOUS_COMMAND>
```

### Export the public and private key pair from the GPG key and create a kubernetes secret for ArgoCD to read them

```shell
$ gpg --export-secret-keys --armor "${GPG_ID}" |
kubectl create secret generic sops-gpg \
--namespace=argocd \
--from-file=sops.asc=/dev/stdin

```

Make sure to replace `argocd` for the namespace in which argo is being deployed

### Store the public key (so other people can encrypt secrets)

```shell
 gpg --export --armor "${GPG_ID}" > .sops.pub.asc
```

And the key can be imported by other people with:

```shell
> gpg --import .sops.pub.asc
```
`
## Configure ArgoCD with KSOPS

On ArgoCD configmap (`argocd-cm`), add the following key and value:

> kustomize.buildOptions: --enable-alpha-plugins


## Patching ArgoCD Repo server

Patch the Argo CD repo server deployment with the following contents:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: argocd-repo-server
  namespace: argocd
spec:
  template:
    spec:
      initContainers:
        - name: install-ksops
          image: viaductoss/ksops:v4.2.5
          command:
            - /bin/sh
            - '-c'
          args:
            - >-
              echo "Installing KSOPS..."; 
              mv ksops /custom-tools/; 
              mv kustomize/custom-tools/; 
              echo "Done.";
          volumeMounts:
            - mountPath: /custom-tools
              name: custom-tools
        - name: import-gpg-key
          image: argoproj/argocd:v2.1.7
          command: ["gpg", "--import","/sops-gpg/sops.asc"]
          env:
            - name: GNUPGHOME
              value: /gnupg-home/.gnupg
          volumeMounts:
            - mountPath: /sops-gpg
              name: sops-gpg
            - mountPath: /gnupg-home
              name: gnupg-home
      containers:
      - name: argocd-repo-server
        env:
          - name: XDG_CONFIG_HOME
            value: /.config
          - name: GNUPGHOME
            value: /home/argocd/.gnupg
        volumeMounts:
        - mountPath: /home/argocd/.gnupg
          name: gnupg-home
          subPath: .gnupg
        - mountPath: /usr/local/bin/kustomize
          name: custom-tools
          subPath: kustomize
        - mountPath: /.config/kustomize/plugin/viaduct.ai/v1/ksops/ksops
          name: custom-tools
          subPath: ksops
      volumes:
      - name: custom-tools
        emptyDir: {}
      - name: gnupg-home
        emptyDir: {}
      - name: sops-gpg
        secret:
          secretName: sops-gpg
```

What are we doing here?

- We are settign up an `initContainer` for our ArgoCD deployment, which contains:
  - The KSOPS installer
  - The GPG Key importer

Patch it with:

```shell
$ kubectl patch deployment -n argocd argocd-repo-server --patch "$(cat repo-deploy-patch.yaml)
```

## Creating a KSOPS secrets generator

Inside the Kustmize overlay ([info here](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)), create a secret generator object:


```yaml
apiVersion: viaduct.ai/v1
kind: ksops
metadata:
  # Specify a name
  name: example-secret-generator
files:
  - ./argo-secret.yaml
```

Where `argo-secret` refers to the secret to be decrypted by ksops.

With this done, reference the generator inside the `kustomization.yaml` file:

```yaml
generators:
  - ./secrets-generator.yaml
  ```

## Conclusion

And voilà! With this setup, everytime you need to encrypt a secret, you just need to:

- Encrypt the file with `sops --encrypt <filename>` (for example, a `secrets.yaml` file)
- Add the file reference to the `secrets-generator.yaml` file
- Commit the **encrypted** file to your Git Repo
- ArgoCD will take care of leveraging KSOPS for decrypting the secrets content
