import { PaginationParams } from '@/core/repositories/Pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const AnswerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!AnswerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(AnswerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const AnswerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return AnswerComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(AnswerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(AnswerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(AnswerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: AnswerComment.id.toString(),
      },
    })
  }
}
