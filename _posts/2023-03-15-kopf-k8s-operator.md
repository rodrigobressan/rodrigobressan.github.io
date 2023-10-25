---
layout: post
title: "Simplifying Kubernetes Operators with Kopf: A Quick Guide"
date: 2023-03-15 09:00:00 -0500
categories: [devops]
tags: [devops, cloud, sysadmin, k8s]
image:
  path: /assets/img/posts/06-kopf/happy_sailors.png
---

[Kubernetes Operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) are powerful tools for managing complex applications in Kubernetes, but they can be challenging to develop and maintain. [Here](https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md) you can find the white paper for the Operator pattern, if you want to know more about it.

In this blog post, we'll explore how Kopf, a Python framework designed to make building and managing Kubernetes Operators easier, that simplifies the creation of a Kubernetes Operator, by creating a basic example that deploys a Node.js application with an Nginx Ingress Controller.

### What is Kopf?

[Kopf](https://github.com/nolar/kopf/) is an open-source Python framework for building Kubernetes Operators. It abstracts many of the complexities of operator development, allowing you to focus on your application's specific logic and behaviors.

### Setting up Kopf: Getting Started

Before diving into our example, let's set up a Python environment and install Kopf:

```bash
# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install Kopf
pip install kopf
```

Now, we're ready to start building our Kubernetes Operator.

### Creating a Simple Node.js Application Operator

Let's create a Kubernetes Operator that deploys a Node.js application and configures an Nginx Ingress Controller. We'll start with the core Python code for the operator:

```python
import kopf
import kubernetes.client as k8s
from kubernetes.client import V1ObjectMeta, V1Deployment, V1Service, V1Ingress, V1ConfigMap

@kopf.on.create('myapp.example.com', 'v1', 'nodejs')
def create_fn(name, spec, **kwargs):
    # Define Kubernetes resources
    deployment = V1Deployment(
        metadata=V1ObjectMeta(name=name),
        spec=spec['deployment']
    )
    service = V1Service(
        metadata=V1ObjectMeta(name=name),
        spec=spec['service']
    )
    ingress = V1Ingress(
        metadata=V1ObjectMeta(name=name),
        spec=spec['ingress']
    )
    configmap = V1ConfigMap(
        metadata=V1ObjectMeta(name=name),
        data={'DB_HOST': spec['database']['host']}
    )

    # Create resources
    api = k8s.ApiClient()
    k8s.AppsV1Api(api).create_namespaced_deployment('default', deployment)
    k8s.CoreV1Api(api).create_namespaced_service('default', service)
    k8s.ExtensionsV1beta1Api(api).create_namespaced_ingress('default', ingress)
    k8s.CoreV1Api(api).create_namespaced_config_map('default', configmap)
```

This Python code defines a function that handles the creation of our Node.js application along with the Nginx Ingress Controller.

### Defining the Custom Resource (CRD)

To use our operator, we need to define a Custom Resource Definition (CRD). Create a YAML file (e.g., `nodejs_app_crd.yaml`) with the following content:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: nodejsapps.myapp.example.com
spec:
  scope: Namespaced
  group: myapp.example.com
  names:
    plural: nodejsapps
    singular: nodejsapp
    kind: NodeJSApp
  versions:
  - name: v1
    served: true
    storage: true
  subresources:
    status: {}
```

Apply the CRD:

```bash
kubectl apply -f nodejs_app_crd.yaml
```

### Deploying the Operator

Now, it's time to deploy our operator. Create a Python file (e.g., `operator.py`) with the following content:

```python
import kopf

@kopf.daemon('myapp.example.com', 'v1', annotations={'config.k8s.io/function': 'kopf'})

def main():
    pass  # This function does nothing, it serves as the entry point for the operator
```

Run your operator:

```bash
kopf run operator.py
```

Your Kopf operator is now up and running, waiting for custom resources to be created.

### Deploying a Node.js Application

Create a custom resource for your Node.js application. Create a YAML file (e.g., `nodejs_app_cr.yaml`) with the following content:

```yaml
apiVersion: myapp.example.com/v1
kind: NodeJSApp
metadata:
  name: my-nodejs-app
spec:
  deployment:
    replicas: 2
    template:
      spec:
        containers:
        - name: nodejs-app
          image: your-nodejs-image:latest
  service:
    selector:
      app: my-nodejs-app
    ports:
    - name: http
      port: 80
  ingress:
    rules:
    - host: my-nodejs-app.example.com
      http:
        paths:
        - backend:
            serviceName: my-nodejs-app
            servicePort: http
  database:
    host: my-database-service
```

Apply your custom resource:

```bash
kubectl apply -f nodejs_app_cr.yaml
```

Kopf will take care of creating the required resources (Deployment, Service, Ingress, and ConfigMap) based on the custom resource.

### Conclusion

Kopf simplifies the development and management of Kubernetes Operators, making it easier to automate complex application deployments. A few more points to consider when using an operator:

- Automated Application Management: Kubernetes Operators automate the deployment, scaling, and management of complex applications. They reduce manual intervention, minimize errors, and ensure consistency.
- Custom Resource Definitions (CRDs): Operators leverage Custom Resource Definitions (CRDs) to define application-specific resources. This allows you to extend Kubernetes to support custom applications and their lifecycles.
- Self-Healing: Operators can monitor the health of application components and perform automated recovery in case of failures
- Scalability: Operators can dynamically scale application components based on resource usage, ensuring optimal performance as workloads changes
- Enhanced Security: Operators can enforce security policies, secrets management, and access controls, contributing to a more secure application environment.


In short, Kopf offer a simple way to setup K8s operators. While operators come with a learning curve and require development effort, the benefits in terms of automation, reliability, and scalability make them a great solution for managing applications in K8s.

