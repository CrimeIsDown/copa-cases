FROM node:8-alpine

RUN apk --update upgrade \
 && apk add --no-cache git openssh-client \
 && update-ca-certificates

RUN git config --global user.email "erictendian@gmail.com" \
 && git config --global user.name "Eric Tendian"

COPY update.sh .

CMD ["/update.sh"]
