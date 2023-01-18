FROM node:lts-alpine

RUN apk --update upgrade \
 && apk add --no-cache bash git openssh-client curl jq \
 && update-ca-certificates

RUN git config --global user.email "erictendian@gmail.com" \
 && git config --global user.name "Eric Tendian"

RUN git clone https://github.com/CrimeIsDown/copa-cases.git

WORKDIR /copa-cases
COPY package.json package-lock.json ./
RUN npm install

COPY update.sh copa-get-cases.js ./

CMD ["/copa-cases/update.sh"]
