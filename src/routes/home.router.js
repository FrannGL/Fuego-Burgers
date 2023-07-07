import express from "express";
export const home = express.Router();

home.get("/", async (req, res) => {
	try {
		const title = "Fuego Burgers®";
		const firstName = req.session.firstName;
		const lastName = req.session.lastName;
		const rol = req.session.rol;
		return res.status(200).render("home", { title, firstName, lastName, rol });
	} catch (err) {
		console.log(err);
		res
			.status(501)
			.send({ status: "error", msg: "Error en el servidor", error: err });
	}
});
