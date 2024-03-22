const Product = require('../models/product');

const getAllProductsStatic = async (req, res)=> {
    const products = await Product.find({ 
        featured: true 
    })
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res)=> {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    } 
    if (numericFilters) {
        const operatorMap = {
            '>':'$gt', 
            '<':'$lt', 
            '=':'eq',
            '>=':'$gte',
            '<=':'$lte'
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx, 
            (match) =>`-${operatorMap[match]}-`
        )
        // on log of filters from above, you'll get something like price-$gt-40, rating-$gte-4
        const options = ['price','rating'];

        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
                // This means { price: { '$gt': 40 }, rating: { '$gte': 4 } }
            }
        })
    }

    let result = Product.find(queryObject)

    // sort
    if (sort) {
       const sortList = sort.split(',').join(' ');
       result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    // fields: This is used to select only certain fields in the schema
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result

    res.status(200).json({ products, nbHits: products.length })
}

module.exports = { 
    getAllProductsStatic, 
    getAllProducts 
}