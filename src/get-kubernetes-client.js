import * as k8s from '@kubernetes/client-node'

let _client

export function getKubernetesClient () {
  if (_client) return _client

  const kc = new k8s.KubeConfig()
  const cluster = {
    name: process.env.K8S_CLUSTER_NAME,
    server: process.env.K8S_CLUSTER_SERVER,
    skipTLSVerify: !!process.env.K8S_CLUSTER_SKIP_TLS || false
  }
  const user = {
    name: process.env.K8S_USER_NAME,
    token: process.env.K8S_USER_TOKEN
  }
  const context = {
    name: 'default',
    user: user.name,
    cluster: cluster.name,
    namespace: process.env.K8S_NAMESPACE
  }
  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name
  })

  _client = kc.makeApiClient(k8s.CoreV1Api)
  return _client
}
