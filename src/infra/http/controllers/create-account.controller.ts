import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

const createdAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreatedAccountBodySchema = z.infer<typeof createdAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createdAccountBodySchema))
  async handle(@Body() body: CreatedAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}
