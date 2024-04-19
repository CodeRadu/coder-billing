FROM node:20

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN ./scripts/build.sh

CMD ./scripts/run.sh