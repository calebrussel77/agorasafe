import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { type TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

const prismaErrorToTrpcCode: Record<string, TRPC_ERROR_CODE_KEY> = {
  P1008: 'TIMEOUT',
  P2000: 'BAD_REQUEST',
  P2001: 'NOT_FOUND',
  P2002: 'CONFLICT',
  P2003: 'CONFLICT',
  P2004: 'CONFLICT',
  P2005: 'BAD_REQUEST',
  P2006: 'BAD_REQUEST',
  P2007: 'BAD_REQUEST',
  P2008: 'INTERNAL_SERVER_ERROR',
  P2009: 'INTERNAL_SERVER_ERROR',
  P2010: 'INTERNAL_SERVER_ERROR',
  P2011: 'BAD_REQUEST',
  P2012: 'BAD_REQUEST',
  P2013: 'BAD_REQUEST',
  P2014: 'CONFLICT',
  P2015: 'NOT_FOUND',
  P2016: 'INTERNAL_SERVER_ERROR',
  P2017: 'INTERNAL_SERVER_ERROR',
  P2018: 'NOT_FOUND',
  P2019: 'BAD_REQUEST',
  P2020: 'BAD_REQUEST',
  P2021: 'INTERNAL_SERVER_ERROR',
  P2022: 'INTERNAL_SERVER_ERROR',
  P2023: 'INTERNAL_SERVER_ERROR',
  P2024: 'TIMEOUT',
  P2025: 'NOT_FOUND',
  P2026: 'INTERNAL_SERVER_ERROR',
  P2027: 'INTERNAL_SERVER_ERROR',
  P2028: 'INTERNAL_SERVER_ERROR',
  P2030: 'INTERNAL_SERVER_ERROR',
  P2033: 'INTERNAL_SERVER_ERROR',
  P2034: 'INTERNAL_SERVER_ERROR',
};

export function throwDbError(error: unknown): never {
  // Always log to console
  console.log(error, 'FROM throwDbError');

  if (error instanceof TRPCError) {
    throw error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError)
    throw new TRPCError({
      code: prismaErrorToTrpcCode[error.code] ?? 'INTERNAL_SERVER_ERROR',
      message:
        "Une erreur inattendue s'est produite. Notre équipe a été informée et résoudra cette erreur dès que possible.",
      cause: error,
    });
  else if (error instanceof Prisma.PrismaClientValidationError)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        "Une erreur inattendue s'est produite. Notre équipe a été informée et résoudra cette erreur dès que possible.",
      cause: error,
    });

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message:
      "Une erreur inattendue s'est produite, veuillez réessayer plus tard.",
    cause: error,
  });
}

export const handleTRPCError = (error: unknown) => {
  const isTrpcError = error instanceof TRPCError;
  if (!isTrpcError) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new TRPCError({
        code: prismaErrorToTrpcCode[error.code] ?? 'INTERNAL_SERVER_ERROR',
        message:
          "Une erreur s'est produite lors de votre requête, Veuillez réessayer plus tard.",
      });
    else if (error instanceof Prisma.PrismaClientValidationError)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "Une erreur inattendue s'est produite. Notre équipe a été informée et résoudra cette erreur dès que possible.",
      });
    else
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "Une erreur inattendue s'est produite. Notre équipe a été informée et résoudra cette erreur dès que possible.",
      });
  }
};

export function throwAuthorizationError(message: string | null = null): never {
  message ??= "Vous n'êtes pas autorisé à effectuer cette action.";
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message,
  });
}

export function throwBadRequestError(
  message: string | null = null,
  error?: unknown
): never {
  message ??= "Votre requête n'est pas valide.";
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message,
    cause: error,
  });
}

export function throwNotFoundError(message: string | null = null): never {
  message ??= "Impossible de trouver l'entité.";
  throw new TRPCError({
    code: 'NOT_FOUND',
    message,
  });
}

export function throwForbiddenError(message: string | null = null): never {
  message ??= "Vous n'êtes pas autorisé à effectuer cette action.";
  throw new TRPCError({
    code: 'FORBIDDEN',
    message,
  });
}

export function throwRateLimitError(
  message: string | null = null,
  error?: unknown
): never {
  message ??=
    'Ralentissez ! Vous avez fait trop de demandes. Veuillez faire une pause.';
  throw new TRPCError({
    code: 'TOO_MANY_REQUESTS',
    message,
    cause: error,
  });
}
