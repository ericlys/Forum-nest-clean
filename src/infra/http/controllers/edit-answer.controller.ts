import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

const editAnswersBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

const bodyValidationBody = new ZodValidationPipe(editAnswersBodySchema)

type EditAnswersBodySchema = z.infer<typeof editAnswersBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswers: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationBody) body: EditAnswersBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.editAnswers.execute({
      content,
      answerId,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
