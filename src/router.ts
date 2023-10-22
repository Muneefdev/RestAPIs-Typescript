import { Router, Request, Response, NextFunction } from "express";
import { handleInputErrors } from "./middlewares/handleValidationErrors";
import { body, oneOf } from "express-validator";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct,
} from "./handlers/product";

const router = Router();

/**
 * Product
 */
router.get("/product", getProducts);
router.get("/product/:id", getProduct);
router.put(
	"/product/:id",
	body("name").isString(),
	handleInputErrors,
	updateProduct
);
router.post(
	"/product",
	body("name").isString(),
	handleInputErrors,
	createProduct
);
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", () => {});
router.get("/update/:id", () => {});

router.put(
	"/update/:id",
	body("title").optional(),
	body("body").optional(),
	body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
	body("version").optional(),
	handleInputErrors,
	() => {}
);

router.post(
	"/update",
	body("title").exists().isString(),
	body("body").exists().isString(),
	body("version").optional(),
	handleInputErrors,
	() => {}
);
router.delete("/update/:id", () => {});

/**
 * Update Points
 */
router.get("/update-point", () => {});
router.get("/update-point/:id", () => {});
router.put(
	"/update-point/:id",
	body("name").optional().isString(),
	body("description").optional().isString(),
	handleInputErrors,
	() => {}
);
router.post(
	"update-point",
	body("name").optional().isString(),
	body("description").optional().isString(),
	body("updateId").exists().isString(),
	handleInputErrors,
	() => {}
);
router.delete("/update-point/:id", () => {});

export default router;
