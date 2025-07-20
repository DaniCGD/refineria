FROM quay.io/keycloak/keycloak:24.0.4

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin123

COPY ./themes /opt/keycloak/themes
COPY ./imports /opt/keycloak/data/import

RUN /opt/keycloak/bin/kc.sh build

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
