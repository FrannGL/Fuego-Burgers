import { cartService } from "../services/carts.service.js";
class CartsController {
	async read(req, res) {
		try {
			const cart = await cartService.read();
			res.status(200).json({
				status: "success",
				payload: cart,
			});
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	}

	async readById(req, res) {
		try {
			const cartId = req.params.cid;
			const cart = await cartService.readById(cartId);
			res.status(200).json({
				status: "success",
				payload: cart,
			});
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	}

	async readByRender(req, res) {
		try {
			const cartId = req.params.cid;
			const cart = await cartService.readByRender(cartId);
			const plainCart = cart.products.map(doc => doc.toObject());
			res.status(200).render("carts", { plainCart });
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	}

	async addProduct(req, res) {
		try {
			const { cid, pid } = req.params;
			const cart = await cartService.addProduct(cid, pid);
			res.status(200).json({
				status: "success",
				payload: cart,
			});
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	}

	async updateCart(req, res) {
		try {
			const { cid } = req.params;
			const { products } = req.body;
			const cart = await cartService.updateCart(cid, products);
			res.status(200).json({ status: "success", message: "Cart updated successfully", cart });
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "error", message: "Internal server error" });
		}
	}

	async updateProductQuantity(req, res) {
		try {
			const { cid, pid } = req.params;
			const { quantity } = req.body;
			const cart = await cartService.updateProductQuantity(cid, pid, quantity);
			res.status(200).json({ status: "success", message: "Product quantity updated", cart });
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "error", message: "Internal server error" });
		}
	}

	async emptyCart(req, res) {
		try {
			const { cid } = req.params;
			await cartService.emptyCart(cid);
			res.status(200).json({ status: "success", message: "Cart cleared successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "error", message: "Internal server error" });
		}
	}

	async deleteProduct(req, res) {
		try {
			const { cid, pid } = req.params;
			const cart = await cartService.deleteProduct(cid, pid);
			res.status(200).json({ status: "success", message: "Product removed from cart", cart });
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "error", message: "Internal server error" });
		}
	}
}

export const cartsController = new CartsController();