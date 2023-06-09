import express from "express";
import { userService } from "../services/users.service.js";
export const usersRouter = express.Router();
import { checkAdmin } from "../utils/checkLogin.js";

usersRouter.get("/", checkAdmin, async (req, res) => {
	try {
		const data = await userService.getAll({});
		const dataParse = data.map(user => {
			return {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				age: user.age,
				email: user.email,
				password: user.password,
				rol: user.rol,
			};
		});
		const firstName = req.session.user.firstName;
		const rol = req.session.user.rol;
		const title = "Fuego Burgers® - Users";
		return res
			.status(200)
			.render("users", { dataParse, title, firstName, rol });
	} catch (err) {
		console.log(err);
		res
			.status(501)
			.send({ status: "error", msg: "Error en el servidor", error: err });
	}
});
