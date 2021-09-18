class ApiFeature{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        const keyword = this.queryString.keyword?{
            name:{
                $regex:this.queryString.keyword,
                $options:'i' //case insensitive
            }
        }:{}
        this.query = this.query.find({...keyword})
        return this
    }
    filter(){
        const querycopy = {...this.queryString}
        // Removing fields from query
        const removeQuery = ['keyword','limit','page']
        removeQuery.forEach(el=>delete querycopy[el])
        // advance filter for price and ratings
        let queryStr = JSON.stringify(querycopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;  
    }
    pagination(resultPerPage){
            const currentPage = Number(this.queryString.page)||1;
            const skip = resultPerPage*(currentPage-1);
            this.query  = this.query.limit(resultPerPage).skip(skip);
            return this
    }   
}
export default ApiFeature