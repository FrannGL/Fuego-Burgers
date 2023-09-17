import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest("http://192.168.1.182:8080/");

describe("TEST API", () => {
  describe("ENDPOINT Products", () => {
    it("GET", async () => {
      const response = await requester.get("api/products");
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an.instanceof(Array);
    });
    it("POST", async () => {
      const productMock = {
        title: "Producto de prueba",
        description: "Esta es una descripción de prueba",
        category: "Electrónica",
        price: 29.99,
        thumbnail: "https://ejemplo.com/imagen.jpg",
        code: 1234,
        stock: 10,
      };
      const response = await requester.post("api/products").send(productMock);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property("_id");
    });
    it("PUT", async () => {
      const productIdToUpdate = "647b6a0c2a2deaefe1fc283c";
      const updatedProductData = {
        title: "TRADI",
        description: "Doble medallon de carne vacuna, doble cheddar, lechuga, tomate, cebolla, salsa mc, pan de papa",
        category: "Linea Clasica",
        price: 3000,
        thumbnail: "./images/img1.jpg",
        code: 1003,
        stock: 100,
      };
      const response = await requester.put(`api/products/${productIdToUpdate}`).send(updatedProductData);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.eql(`Has actualizado el producto con ID ${productIdToUpdate}`);
    });
    it("DELETE", async () => {
      const productIdToDelete = "65064ffdf2d8d7a038ce98ac";
      const response = await requester.delete(`api/products/${productIdToDelete}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.eql(`Has eliminado el producto con ID ${productIdToDelete}`);
    });
  });

  describe("ENDPOINT Carts", () => {
    it("GET", async () => {
      const response = await requester.get("api/carts");
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an.instanceof(Array);
    });
    it("POST", async () => {
      const response = await requester.post("api/carts/BpK57ZOIQBmqd2wjRdLk5yxSy/products/65063bfab17d31351bc0594f");
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.property("_id");
    });
    it("PUT", async () => {
      const cartId = "nwhaMJX0ZwyerCRlrCHI1XtoP";
      const updatedCartData = {
        products: [
          {
            product: "647b6a152a2deaefe1fc283e",
            quantity: 2,
          },
          {
            product: "647b6a362a2deaefe1fc2846",
            quantity: 8,
          },
        ],
      };
      const response = await requester.put(`api/carts/${cartId}`).send(updatedCartData);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql("Cart updated successfully");
    });
    it("DELETE", async () => {
      const cartIdToDelete = "gcTRQdsS3WwukCWDYiDAgSfmf";
      const response = await requester.delete(`api/carts/${cartIdToDelete}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.have.eql("Cart cleared successfully");
    });
  });

  describe("ENDPOINT Sessions", () => {
    let cookieName;
    let cookieValue;
    const mockUser = {
      firstName: "Coder",
      lastName: "Test",
      age: 100,
      email: faker.internet.email(),
      password: "123",
    };

    it("REGISTER", async () => {
      const response = await requester.post("api/sessions/register").send(mockUser);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { status } = response;

      expect(status).to.equal(302);
    });

    it("LOGIN", async () => {
      const result = await requester.post("api/sessions/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      const cookie = result.headers["set-cookie"][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split("=")[0];
      cookieValue = cookie.split("=")[1];

      expect(cookieName).to.be.ok.and.eql("connect.sid");
      expect(cookieValue).to.be.ok;
    });

    it("CURRENT USER", async () => {
      const { _body } = await requester.get("api/sessions/current").set("Cookie", [`${cookieName}=${cookieValue}`]);

      expect(_body.user.email).to.be.eql(mockUser.email);
    });
  });
});