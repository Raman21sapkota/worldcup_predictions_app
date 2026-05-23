export class BaseRepository {
  constructor(prismaModel) {
    this.model = prismaModel
  }

  async findById(id) {
    return this.model.findUnique({ where: { id } })
  }

  async findOne(where) {
    return this.model.findFirst({ where })
  }

  async findAll(where = {}) {
    return this.model.findMany({ where })
  }

  async create(data) {
    return this.model.create({ data })
  }

  async update(where, data) {
    return this.model.update({ where, data })
  }

  async delete(where) {
    return this.model.delete({ where })
  }

  async count(where = {}) {
    return this.model.count({ where })
  }
}
