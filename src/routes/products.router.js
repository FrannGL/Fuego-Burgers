import express from "express";
import { productService } from "../services/products.service.js";
export const productsRouter = express.Router();
import checkLogin from "../utils/checkLogin.js";

productsRouter.get("/", checkLogin, async (req, res) => {
	try {
		const { limit, pagina, category, orderBy } = req.query;
		const data = await productService.getAllWithPagination(
			limit,
			pagina,
			category,
			orderBy
		);
		const { firstName, rol } = req.session.user;
		const { totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } =
			data;
		const plainProducts = data.docs.map(doc => doc.toObject());
		const title = "Listado de Productos";
		return res.status(200).render("products", {
			title,
			firstName,
			rol,
			plainProducts,
			totalPages,
			page,
			hasPrevPage,
			hasNextPage,
			prevPage,
			nextPage,
		});
	} catch (err) {
		console.log(err);
		res
			.status(501)
			.send({ status: "error", msg: "Error en el servidor", error: err });
	}
});
