import { Query } from 'mongoose'
import { ParsedQs } from 'qs'

export class APIFeatures<T> {
	query: Query<T[], T>
	queryString: ParsedQs

	constructor(query: Query<T[], T>, queryString: ParsedQs) {
		this.query = query
		this.queryString = queryString
	}

	pagination() {
		const page = Number(this.queryString.page) || 1
		const limit = Number(this.queryString.limit) || 5
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
		const queryObj = { ...this.queryString }

		const excludedFields = ['page', 'sort', 'limit', 'search']
		excludedFields.forEach((el) => delete queryObj[el])

		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match)

		this.query = this.query.find(JSON.parse(queryStr))
		return this
	}
}
