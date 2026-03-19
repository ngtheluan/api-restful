import { Request, Response } from 'express'
import Products from '../models/productModel'

const productController = {
	getProducts: async (req: Request, res: Response) => {
		try {
			const products = await Products.find()
			return res.status(200).json(products)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Internal server error'
			return res.status(500).json({ message })
		}
	},

	getDetail: async (req: Request, res: Response) => {
		try {
			const products = await Products.findById(req.params.id)
			if (!products) return res.status(404).json({ message: 'Product not found.' })
			return res.status(200).json(products)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Internal server error'
			return res.status(500).json({ message })
		}
	},

	addProduct: async (req: Request, res: Response) => {
		try {
			const { title, price, description, category, image } = req.body
			const newProduct = new Products({ title, price, description, category, image })
			await newProduct.save()
			return res.status(200).json(newProduct)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Internal server error'
			return res.status(500).json({ message })
		}
	},

	updateProduct: async (req: Request, res: Response) => {
		try {
			const { title, price, description, category, image } = req.body
			const product = await Products.findByIdAndUpdate(
				req.params.id,
				{ title, price, description, category, image },
				{ new: true }
			)
			if (!product) return res.status(404).json({ message: 'Product not found.' })
			return res.status(200).json(product)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Internal server error'
			return res.status(500).json({ message })
		}
	},

	deleteProduct: async (req: Request, res: Response) => {
		try {
			const product = await Products.findByIdAndDelete(req.params.id)
			if (!product) return res.status(404).json({ message: 'Product not found.' })
			return res.status(200).json('Delete success.')
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Internal server error'
			return res.status(500).json({ message })
		}
	},
}

export default productController
