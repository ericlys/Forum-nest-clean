import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import { z } from 'zod'
// import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'

// const createdAccountBodySchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string(),
// })

// type CreatedAccountBodySchema = z.infer<typeof createdAccountBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  // @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(createdAccountBodySchema))
  async handle() {
    const token = this.jwt.sign({ sub: 'user-id' })

    return token
  }
}
