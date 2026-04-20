# NextChat Helm Chart

NextChat 应用的 Helm Chart，用于在 Kubernetes 集群中部署前端和后端服务。

## 快速开始

### 安装

```bash
# 添加 Helm 仓库（如果已发布到仓库）
helm repo add nextchat https://example.com/charts
helm repo update

# 使用默认配置安装
helm install nextchat ./helm -n nextchat --create-namespace

# 指定配置安装
helm install nextchat ./helm -n nextchat \
  --set frontend.image.repository=your-registry/chatgpt-next-web \
  --set backend.image.repository=your-registry/nextchat-backend \
  --set frontend.env.OPENAI_API_KEY=your-api-key \
  --set frontend.env.CODE=your-password
```

### 升级

```bash
helm upgrade nextchat ./helm -n nextchat
```

### 卸载

```bash
helm uninstall nextchat -n nextchat
```

## 配置项

### 全局配置

| 参数                     | 描述         | 默认值           |
| ------------------------ | ------------ | ---------------- |
| `global.imagePullPolicy` | 镜像拉取策略 | `IfNotPresent`   |
| `global.imageRegistry`   | 镜像仓库地址 | 空               |
| `global.storageClass`    | 存储类名称   | 空（使用默认类） |

### 前端配置

| 参数                               | 描述           | 默认值                         |
| ---------------------------------- | -------------- | ------------------------------ |
| `frontend.enabled`                 | 是否启用前端   | `true`                         |
| `frontend.replicaCount`            | Pod 副本数     | `1`                            |
| `frontend.image.repository`        | 镜像地址       | `yidadaa/chatgpt-next-web`     |
| `frontend.image.tag`               | 镜像标签       | `.Chart.AppVersion`            |
| `frontend.service.type`            | Service 类型   | `ClusterIP`                    |
| `frontend.service.port`            | 端口           | `3000`                         |
| `frontend.resources.limits.cpu`    | CPU 限制       | `500m`                         |
| `frontend.resources.limits.memory` | 内存限制       | `512Mi`                        |
| `frontend.env.OPENAI_API_KEY`      | OpenAI API Key | 空                             |
| `frontend.env.CODE`                | 访问密码       | 空                             |
| `frontend.env.BASE_URL`            | 后端地址       | `http://nextchat-backend:3001` |
| `frontend.env.ENABLE_MCP`          | 启用 MCP       | 空                             |

### 后端配置

| 参数                               | 描述           | 默认值                     |
| ---------------------------------- | -------------- | -------------------------- |
| `backend.enabled`                  | 是否启用后端   | `true`                     |
| `backend.replicaCount`             | Pod 副本数     | `1`                        |
| `backend.image.repository`         | 镜像地址       | `yidadaa/nextchat-backend` |
| `backend.image.tag`                | 镜像标签       | `.Chart.AppVersion`        |
| `backend.service.type`             | Service 类型   | `ClusterIP`                |
| `backend.service.port`             | 端口           | `3001`                     |
| `backend.persistence.enabled`      | 启用持久化存储 | `true`                     |
| `backend.persistence.size`         | PVC 大小       | `1Gi`                      |
| `backend.persistence.mountPath`    | 挂载路径       | `/opt/chat/data`           |
| `backend.persistence.storageClass` | 存储类         | 空                         |
| `backend.persistence.accessMode`   | 访问模式       | `ReadWriteOnce`            |

## 示例

### 使用自定义镜像仓库

```yaml
# values-custom.yaml
global:
  imageRegistry: registry.example.com

frontend:
  image:
    repository: chatgpt-next-web

backend:
  image:
    repository: nextchat-backend
```

### 启用 Ingress

```yaml
# values-ingress.yaml
frontend:
  ingress:
    enabled: true
    className: nginx
    host: chat.example.com
    tls:
      enabled: true
      secretName: chat-tls
```

### 使用已有 PVC

```yaml
# values-existing-pvc.yaml
backend:
  persistence:
    enabled: true
    existingClaim: my-existing-pvc
```

### 生产环境完整配置

```yaml
# values-prod.yaml
global:
  imagePullPolicy: Always

frontend:
  replicaCount: 2
  image:
    repository: registry.example.com/chatgpt-next-web
    tag: v2.15.8
  service:
    type: LoadBalancer
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 200m
      memory: 256Mi
  env:
    OPENAI_API_KEY: sk-xxx
    CODE: password123
    BASE_URL: http://nextchat-backend:3001
    ENABLE_MCP: "true"

backend:
  replicaCount: 1
  image:
    repository: registry.example.com/nextchat-backend
    tag: v1.0.0
  service:
    type: ClusterIP
  persistence:
    enabled: true
    size: 10Gi
    storageClass: fast-disk
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 128Mi
```

## 部署

```bash
helm install nextchat ./helm -f values-prod.yaml -n nextchat
```

## 文件结构

```
helm/
├── Chart.yaml              # Chart 元数据
├── values.yaml           # 默认配置
├── README.md            # 本文档
└── templates/
    ├── _helpers.tpl     # 辅助函数
    ├── deployment-frontend.yaml
    ├── deployment-backend.yaml
    ├── pvc-backend.yaml
    ├── service-frontend.yaml
    └── service-backend.yaml
```
