class ApiFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }


    Search() {
        console.log("3")
     console.log(this.queryString)
        const keyword = this.queryString.keyword ? {
            name: { $regex: this.queryString.keyword, $options: "i" }
        } : {}
        this.query = this.query.find(keyword)
        return this

    }

    
    //filter
    Filter() {
        const copyr = { ... this.queryString } //making copy of queryString object
        //remove field from categories
        const removefield = ["limit", "page", "keyword"]
        removefield.forEach((value) => {
            delete copyr[value]
        })

        //for price and rating
        let queryString = JSON.stringify(copyr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (value) => `$${value}`)
        console.log("s",queryString)
        this.query = this.query.find(JSON.parse(queryString))

        return this
    }


    pagination(x) {

        let perpagelimit = x   //post 
        let currentpage = Number(this.queryString.page) || 1
        const skip = perpagelimit * (currentpage - 1)
        this.query = this.query.find().skip(skip).limit(perpagelimit)
        return this
    
    }
}
module.exports = ApiFeature