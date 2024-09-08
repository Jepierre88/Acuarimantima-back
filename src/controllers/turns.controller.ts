import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {WorkShift} from '../models';
import {WorkShiftRepository} from '../repositories';

export class TurnsController {
  constructor(
    @repository(WorkShiftRepository)
    public workShiftRepository : WorkShiftRepository,
  ) {}

  @post('/turns')
  @response(200, {
    description: 'WorkShift model instance',
    content: {'application/json': {schema: getModelSchemaRef(WorkShift)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkShift, {
            title: 'NewWorkShift',
            exclude: ['id'],
          }),
        },
      },
    })
    workShift: Omit<WorkShift, 'id'>,
  ): Promise<WorkShift> {
    return this.workShiftRepository.create(workShift);
  }

  @get('/turns/count')
  @response(200, {
    description: 'WorkShift model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WorkShift) where?: Where<WorkShift>,
  ): Promise<Count> {
    return this.workShiftRepository.count(where);
  }

  @get('/turns')
  @response(200, {
    description: 'Array of WorkShift model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WorkShift, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WorkShift) filter?: Filter<WorkShift>,
  ): Promise<WorkShift[]> {
    return this.workShiftRepository.find(filter);
  }

  @patch('/turns')
  @response(200, {
    description: 'WorkShift PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkShift, {partial: true}),
        },
      },
    })
    workShift: WorkShift,
    @param.where(WorkShift) where?: Where<WorkShift>,
  ): Promise<Count> {
    return this.workShiftRepository.updateAll(workShift, where);
  }

  @get('/turns/{id}')
  @response(200, {
    description: 'WorkShift model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WorkShift, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WorkShift, {exclude: 'where'}) filter?: FilterExcludingWhere<WorkShift>
  ): Promise<WorkShift> {
    return this.workShiftRepository.findById(id, filter);
  }

  @patch('/turns/{id}')
  @response(204, {
    description: 'WorkShift PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkShift, {partial: true}),
        },
      },
    })
    workShift: WorkShift,
  ): Promise<void> {
    await this.workShiftRepository.updateById(id, workShift);
  }

  @put('/turns/{id}')
  @response(204, {
    description: 'WorkShift PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() workShift: WorkShift,
  ): Promise<void> {
    await this.workShiftRepository.replaceById(id, workShift);
  }

  @del('/turns/{id}')
  @response(204, {
    description: 'WorkShift DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workShiftRepository.deleteById(id);
  }
}
