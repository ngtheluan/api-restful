import { Query } from 'mongoose'
import qs, { ParsedQs } from 'qs'

export class APIFeatures<T> {
	query: Query<T[], T>
	queryString: ParsedQs

	constructor(query: Query<T[], T>, queryString: ParsedQs) {
		this.query = query
		this.queryString = queryString
	}

	paginating() {
		const page = Number(this.queryString.page) || 1
		const limit = Number(this.queryString.limit)
		const skip = limit * (page - 1)
		this.query = this.query.skip(skip).limit(limit)
		return this
	}

	sorting = () => {
		const sort = (this.queryString.sort as string) || '-createdAt'
		this.query = this.query.sort(sort)
		return this
	}

	searching = () => {
		const search = this.queryString.search
		if (search) {
			this.query = this.query.find({ $text: { $search: search } } as any)
		} else {
			this.query = this.query.find()
		}
		return this
	}

	filtering = () => {
		// 👉 parse lại query để hỗ trợ price[gte]
		const parsedQuery = qs.parse(this.queryString as any)

		const queryObj: any = { ...parsedQuery }

		const excludedFields = ['page', 'sort', 'limit', 'search']
		excludedFields.forEach((el) => delete queryObj[el])

		let queryStr = JSON.stringify(queryObj)

		// 👉 thêm $ cho mongo operator
		queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match)

		let mongoQuery = JSON.parse(queryStr)

		// 👉 convert string -> number (quan trọng)
		Object.keys(mongoQuery).forEach((field) => {
			if (typeof mongoQuery[field] === 'object') {
				Object.keys(mongoQuery[field]).forEach((op) => {
					const value = mongoQuery[field][op]

					// nếu là số thì convert
					if (!isNaN(value)) {
						mongoQuery[field][op] = Number(value)
					}
				})
			}
		})

		this.query = this.query.find(mongoQuery)

		return this
	}

	counting = () => {
		return this.query.model.countDocuments(this.query.getFilter())
	}
}
