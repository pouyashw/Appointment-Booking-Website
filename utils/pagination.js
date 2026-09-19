const createPaginationData = (page, limit, totalCount, resourceName) => ({
    page,
    limit,
    totalPage: Math.ceil(totalCount / limit),
    ["totalPage" + resourceName]: totalCount
})

module.exports = { createPaginationData }