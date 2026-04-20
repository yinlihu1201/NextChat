{{/*
Expand the name of the chart.
*/}}
{{- define "nextchat.name" -}}
{{- default .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "nextchat.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version.
*/}}
{{- define "nextchat.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create default labels.
*/}}
{{- define "nextchat.labels" -}}
helm.sh/chart: {{ include "nextchat.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/name: {{ include "nextchat.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Values.global.labels }}
{{- toYaml .Values.global.labels | nindent 2 }}
{{- end }}
{{- end -}}

{{/*
Selector labels.
*/}}
{{- define "nextchat.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nextchat.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use.
*/}}
{{- define "nextchat.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "nextchat.fullname" .) -}}
{{- else -}}
{{- default "default" -}}
{{- end -}}
{{- end -}}