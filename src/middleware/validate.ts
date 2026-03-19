import { NextFunction, Request, Response } from 'express'

export const checkProductData = (req: Request, res: Response, next: NextFunction) => {
	const error = []

	for (const key in req.body) {
		if (!req.body[key]) {
			error.push(`Please add product ${key}`)
		}

		if (error.length > 0) {
			return res.status(401).json({ message: error })
		}
	}

	next()
}
