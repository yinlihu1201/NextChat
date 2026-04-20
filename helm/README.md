# NextChat Helm Chart

NextChat 应用的 Helm Chart，用于在 Kubernetes 集群中部署 NextChat（前端和后端已整合）。

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
  --set openaiApiKey=your-api-key \
  --set code=your-password
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

| 参数                     | 描述         | 默认值         |
| ------------------------ | ------------ | -------------- |
| `global.imagePullPolicy` | 镜像拉取策略 | `IfNotPresent` |
| `global.imageRegistry`   | 镜像仓库地址 | 空             |

### NextChat 配置

| 参数                                | 描述            | 默认值                   |
| ----------------------------------- | --------------- | ------------------------ |
| `replicaCount`                      | Pod 副本数      | `1`                      |
| `frontend.image.repository`         | 镜像地址        | `yidadaa/nextchat-front` |
| `frontend.image.tag`                | 镜像标签        | `1.0`                    |
| `frontend.resources.limits.cpu`     | CPU 限制        | `500m`                   |
| `frontend.resources.limits.memory`  | 内存限制        | `512Mi`                  |
| `frontend.persistence.enabled`      | 启用持久化存储  | `true`                   |
| `frontend.persistence.size`         | PVC 大小        | `1Gi`                    |
| `frontend.persistence.mountPath`    | 挂载路径        | `/opt/chat/data`         |
| `frontend.persistence.storageClass` | 存储类          | 空                       |
| `frontend.persistence.accessMode`   | 访问模式        | `ReadWriteOnce`          |
| `openaiApiKey`                      | OpenAI API Key  | 空                       |
| `googleApiKey`                      | Google API Key  | 空                       |
| `baseUrl`                           | 自定义 BASE_URL | 空                       |
| `code`                              | 访问密码        | 空                       |
| `enableMcp`                         | 启用 MCP        | 空                       |
| `dataDir`                           | 数据目录        | `/opt/chat/data`         |

## 示例

### 使用自定义镜像仓库

```yaml
# values-custom.yaml
global:
  imageRegistry: registry.example.com

frontend:
  image:
    repository: chatgpt-next-web
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
    BASE_URL: http://your-custom-url
    ENABLE_MCP: "true"
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
    ├── deployment.yaml  # 部署配置
    ├── pvc.yaml        # 卷存储配置
    └── service.yaml     # 服务配置
```
