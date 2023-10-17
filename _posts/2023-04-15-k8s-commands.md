---
layout: post
title: "Essential kubectl Commands"
date: 2023-04-15 09:00:00 -0500
categories: [devops]
tags: [devops, cloud, sysadmin, k8s]
image:
  path: /assets/img/posts/06-kopf/happy_sailors.png
---

`kubectl` is the Swiss Army knife of Kubernetes, providing several commands to interact with your K8s cluster. In this blog post, we'll explore a range of `kubectl` commands for various day-to-day operations


### 1. List Resources

- **List all resources:** `kubectl get all`
- **List resources in a namespace:** `kubectl get all -n my-namespace`
- **List all resources in all namespaces:** `kubectl get all --all-namespaces`

### 2. Resource Inspection

- **Inspect a resource:** `kubectl describe pod my-pod`
- **View resource config in YAML format:** `kubectl get pod my-pod -o yaml`

### 3. Troubleshooting

- **View container logs:** `kubectl logs my-pod`
- **Start an interactive shell in a container:** `kubectl exec -it my-pod -- /bin/sh`
- **Check resource events:** `kubectl describe pod my-pod`

### 4. Scaling and Updates

- **Scale replicas for a deployment:** `kubectl scale --replicas=5 deployment/my-deployment`
- **Perform a rolling update:** `kubectl set image deployment/my-deployment my-container=new-image:tag`

### 5. Contexts and Switching

- **List available contexts:** `kubectl config get-contexts`
- **Switch to a context:** `kubectl config use-context my-context`

### 6. Resource Deletion

- **Delete a resource:** `kubectl delete pod my-pod`
- **Delete resources in a namespace:** `kubectl delete all --all -n my-namespace`
- **Delete all resources in all namespaces (with caution):** `kubectl delete all --all --all-namespaces`

### 7. Port Forwarding

- **Forward a local port to a service:** `kubectl port-forward service/my-service 8080:80`

### 8. Accessing Logs

- **Access logs for a previous container:** `kubectl logs -p my-pod`

### 9. Getting Resource Status

- **Check resource status in real-time:** `kubectl get pods -n my-namespace -w`

### 10. Executing Commands in a Container

- **Run a command in a container:** `kubectl exec my-pod -- ls /app`

### 11. Copying Files

- **Copy files from a container:** `kubectl cp my-pod:/path/to/source /path/to/destination`

### 12. Resource Modification

- **Edit a resource configuration in the default editor:** `kubectl edit pod my-pod`
- **Apply changes to a resource without needing to delete and recreate:** `kubectl apply -f my-updated-pod.yaml`

### 13. Rollout Status

- **Check rollout status of a deployment:** `kubectl rollout status deployment/my-deployment`

### 14. Rollback Deployments

- **Roll back a deployment to a previous revision:** `kubectl rollout undo deployment/my-deployment`

### 15. Secrets and ConfigMaps

- **Create a Secret:** `kubectl create secret generic my-secret --from-literal=secret-key=secret-value`
- **Create a ConfigMap:** `kubectl create configmap my-configmap --from-literal=config-key=config-value`

### 16. Access Control

- **Create a Role:** `kubectl create role my-role --verb=get,list,create --resource=pods,pods/log --namespace=my-namespace`
- **Create a RoleBinding:** `kubectl create rolebinding my-binding --role=my-role --user=my-user`

### 17. Resource Labeling

- **Label a resource (e.g., a pod named `my-pod`):** `kubectl label pod my-pod my-label=my-value`

### 18. Node Troubleshooting

- **Describe a node to inspect its details:** `kubectl describe node my-node`

### 19. Service Exposing

- **Expose a deployment as a service:** `kubectl expose deployment my-deployment --port=80 --target-port=80 --type=LoadBalancer`

### 20. Custom Columns in Output

- **Display custom columns in resource listings:** `kubectl get pods -o custom-columns=NAME:.metadata.name,IMAGE:.spec.containers[*].image`
