@'
# RIMAC Appointments API

API backend para la gestión y procesamiento asíncrono de citas médicas.

La solución utiliza AWS Serverless, TypeScript, Node.js, DynamoDB, SNS, SQS, EventBridge y MySQL sobre Amazon RDS, aplicando principios de Clean Architecture, SOLID y patrones de diseño.

---

## 1. Descripción

La API permite registrar citas médicas asociadas a un asegurado y consultar sus citas mediante su `insuredId`.

El procesamiento de una cita es asíncrono:

1. La API recibe la solicitud.
2. La cita se registra inicialmente en DynamoDB con estado `PENDING`.
3. Se publica un evento en SNS.
4. SNS distribuye el mensaje hacia la cola SQS correspondiente según el país.
5. Una Lambda específica para Perú o Chile procesa la cita.
6. La cita se registra en MySQL sobre Amazon RDS.
7. La Lambda publica un evento de confirmación mediante EventBridge.
8. EventBridge entrega el evento a una cola SQS de confirmación.
9. La Lambda de confirmación actualiza la cita en DynamoDB a `COMPLETED`.

---

## 2. Instalación

Clonar el repositorio:

git clone <REPOSITORY_URL>

Ingresar al proyecto:

cd rimac-appointments-apis

Instalar las dependencias:

npm install

## 3. Variables de entorno

Crear un archivo .env en la raíz del proyecto:

DB_HOST=<RDS_ENDPOINT>
DB_PORT=3306
DB_NAME=rimac_appointments
DB_USER=<DB_USER>
DB_PASSWORD=<DB_PASSWORD>

No subir el archivo .env al repositorio.

Agregar al .gitignore:

.env
key.json
node_modules/
dist/
.serverless/
## 4. Ejecutar localmente

Compilar el proyecto:

npm run build

Ejecutar los tests:

npm test

Para ejecutar el proyecto localmente con Serverless Offline:

npx serverless offline

## 5. OpenAPI / Swagger

La especificación de la API se encuentra en:

openapi.yaml

Validar la especificación:

npx redocly lint openapi.yaml

Generar la documentación HTML:

npx redocly build-docs openapi.yaml

Esto genera:

redoc-static.html

Abrir redoc-static.html en el navegador para visualizar la documentación de la API.

La documentación incluye:

POST /appointments
GET /appointments
Request schemas
Response schemas
Ejemplos para Perú y Chile
Códigos HTTP
Parámetro insuredId

## 6. Deployment

Configurar las credenciales de AWS:

aws configure

Verificar las credenciales:

aws sts get-caller-identity

Compilar el proyecto:

npm run build

Desplegar la infraestructura completa:

npx serverless deploy

Para desplegar únicamente una función:

npx serverless deploy function -f appointment

Ejemplo:

npx serverless deploy function -f appointmentPe

## 7. API desplegada

Base URL:

https://hhb6exc0ae.execute-api.us-east-1.amazonaws.com/dev
POST /appointments
