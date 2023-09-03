import { UniqueEntityID } from '../entities/unique-entity-id'

// contrato que especifica a estrutura de um evento de domínio
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
