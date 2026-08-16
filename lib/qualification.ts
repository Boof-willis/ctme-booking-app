import { GainsBracket, PortfolioBracket, TransactionBracket } from '@/types/survey';
import {
  GAINS_BRACKETS,
  PORTFOLIO_BRACKETS,
  TRANSACTION_BRACKETS,
  QUALIFYING_GAINS_INDEX,
  QUALIFYING_PORTFOLIO_INDEX,
  QUALIFYING_TRANSACTION_INDEX,
} from './constants';

export interface QualifierAnswers {
  gainsBracket?: GainsBracket;
  portfolioBracket?: PortfolioBracket;
  transactionBracket?: TransactionBracket;
}

export function hasAnsweredQualifier(a: QualifierAnswers): boolean {
  return Boolean(a.gainsBracket && a.portfolioBracket && a.transactionBracket);
}

/**
 * A lead qualifies for a consultation if ANY one of the three thresholds is met:
 * realized gains ≥ $50k, portfolio ≥ $100k, or ≥ 6,000 transactions.
 */
export function isQualified(a: QualifierAnswers): boolean {
  const gainsIdx = a.gainsBracket ? GAINS_BRACKETS.indexOf(a.gainsBracket) : -1;
  const portfolioIdx = a.portfolioBracket ? PORTFOLIO_BRACKETS.indexOf(a.portfolioBracket) : -1;
  const txIdx = a.transactionBracket ? TRANSACTION_BRACKETS.indexOf(a.transactionBracket) : -1;

  return (
    gainsIdx >= QUALIFYING_GAINS_INDEX ||
    portfolioIdx >= QUALIFYING_PORTFOLIO_INDEX ||
    txIdx >= QUALIFYING_TRANSACTION_INDEX
  );
}
