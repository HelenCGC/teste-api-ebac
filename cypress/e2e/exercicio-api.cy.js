/// <reference types="cypress" />
import contrato from "../contracts/usuarios.contract";
import { faker } from "@faker-js/faker";

describe("Testes da Funcionalidade Usuários", () => {
  let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`;
  let email = `usuario${Math.floor(Math.random() * 100000000)}@ebac.com`;
  let password = faker.internet.password();
  let administrador = faker.datatype.boolean().toString();

  it("Deve validar contrato de usuários", () => {
    cy.request("usuarios").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("usuarios");
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    cy.request({
      method: "POST",
      url: "usuarios",
      body: {
        nome: usuario,
        email: email,
        administrador: administrador,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.cadastrarUsuario(usuario, "teste@.com", administrador, password).then(
      (response) => {
        console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.email).to.equal("email deve ser um email válido");
      }
    );
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    let email = `usuario${Math.floor(Math.random() * 100000000)}@ebac.com`;
    cy.request("usuarios").then((response) => {
      let id = response.body.usuarios[0]._id;
      cy.request({
        method: "PUT",
        url: `usuarios/${id}`,
        body: {
          nome: usuario,
          email: email,
          administrador: administrador,
          password: password,
        },
      }).then((response) => {
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    let email = `usuario${Math.floor(Math.random() * 100000000)}@ebac.com`;
    cy.cadastrarUsuario(usuario, email, administrador, password).then(
      (response) => {
        let id = response.body._id;
        cy.request({
          method: "DELETE",
          url: `usuarios/${id}`,
        }).then((response) => {
          expect(response.body.message).to.equal(
            "Registro excluído com sucesso"
          );
          expect(response.status).to.equal(200);
        });
      }
    );
  });
});
