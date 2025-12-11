import { BadRequestException } from '@nestjs/common';

export type PaginationData = {
  request: {
    skip: number;
    limit: number;
  };
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

/**
 * Converts filter string to MongoDB/Mongoose where clause
 * Supports MongoDB-style operators:
 *
 * Basic: eq, ne, in, nin
 * Comparison: gt, lt, gte, lte
 * String: like, ilike, startsWith, endsWith, notContains
 * Date: day, month, year, dateRange, before, after
 * Array: has, hasSome, hasEvery, isEmpty
 * NULL: isNull, isNotNull
 * Boolean: isTrue, isFalse
 * JSON: jsonContains, jsonHas
 * Full-text: search (text search)
 * Range: between
 */
export function filterParamsDecoder(filters: string): any {
  try {
    if (!filters || filters === '{}') return {};

    const decoded = JSON.parse(filters.replace(/'/g, '"'));

    const isValidDate = (value: any): boolean =>
      typeof value === 'string' && !isNaN(new Date(value).getTime());

    const parseValue = (field: string, value: any, operator: string) => {
      // Handle dates
      if (
        isValidDate(value) &&
        ['day', 'month', 'year', 'before', 'after', 'dateRange'].includes(
          operator,
        )
      ) {
        const date = new Date(value);

        if (operator === 'day') {
          const start = new Date(date);
          start.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return { gte: start, lt: end };
        }

        if (operator === 'month') {
          const start = new Date(date.getFullYear(), date.getMonth(), 1);
          const end = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
          return { gte: start, lte: end };
        }

        if (operator === 'year') {
          const start = new Date(date.getFullYear(), 0, 1);
          const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
          return { gte: start, lte: end };
        }

        if (operator === 'before') {
          return { lt: date };
        }

        if (operator === 'after') {
          return { gt: date };
        }

        return date;
      }

      // Handle boolean strings
      if (
        typeof value === 'string' &&
        ['true', 'false'].includes(value.toLowerCase())
      ) {
        return value.toLowerCase() === 'true';
      }

      // Handle numeric strings
      if (
        typeof value === 'string' &&
        !isNaN(Number(value)) &&
        operator !== 'like' &&
        operator !== 'ilike'
      ) {
        return Number(value);
      }

      return value;
    };

    const buildGroup = (group: Record<string, any> | any[]) => {
      const queryParts: any[] = [];

      if (Array.isArray(group)) {
        // Handle array format for OR conditions
        for (const item of group) {
          for (const rawKey in item) {
            const [field, op = 'eq'] = rawKey.split('__');
            const value = item[rawKey];
            const parsed = parseValue(field, value, op);

            queryParts.push(buildCondition(field, op, value, parsed));
          }
        }
      } else {
        // Handle object format
        for (const rawKey in group) {
          const [field, op = 'eq'] = rawKey.split('__');
          const value = group[rawKey];
          const parsed = parseValue(field, value, op);

          queryParts.push(buildCondition(field, op, value, parsed));
        }
      }

      return queryParts;
    };

    const buildCondition = (
      field: string,
      op: string,
      value: any,
      parsed: any,
    ) => {
      switch (op) {
        // ===== Basic Operators =====
        case 'eq':
          return typeof parsed === 'object' && parsed.gte
            ? { [field]: parsed }
            : { [field]: { equals: parsed } };

        case 'ne':
        case 'neq':
          return { [field]: { not: parsed } };

        case 'in':
          const inValues = Array.isArray(value) ? value : [value];
          return { [field]: { in: inValues } };

        case 'nin':
        case 'notIn':
          const ninValues = Array.isArray(value) ? value : [value];
          return { [field]: { notIn: ninValues } };

        // ===== Comparison Operators =====
        case 'gt':
          return { [field]: { gt: parsed } };

        case 'lt':
          return { [field]: { lt: parsed } };

        case 'gte':
          return { [field]: { gte: parsed } };

        case 'lte':
          return { [field]: { lte: parsed } };

        // ===== Range Operator =====
        case 'between':
          if (!Array.isArray(value) || value.length !== 2) {
            throw new BadRequestException(
              `'between' operator requires array with 2 values: [min, max]`,
            );
          }
          return {
            [field]: {
              gte: parseValue(field, value[0], 'gte'),
              lte: parseValue(field, value[1], 'lte'),
            },
          };

        // ===== String Operators =====
        case 'like':
        case 'contains':
          return { [field]: { contains: value, mode: 'insensitive' } };

        case 'ilike':
          return { [field]: { contains: value, mode: 'insensitive' } };

        case 'startsWith':
          return { [field]: { startsWith: value, mode: 'insensitive' } };

        case 'endsWith':
          return { [field]: { endsWith: value, mode: 'insensitive' } };

        case 'notContains':
          return {
            NOT: {
              [field]: { contains: value, mode: 'insensitive' },
            },
          };

        // ===== NULL Operators =====
        case 'isNull':
          return { [field]: null };

        case 'isNotNull':
          return { [field]: { not: null } };

        // ===== Boolean Operators =====
        case 'isTrue':
          return { [field]: true };

        case 'isFalse':
          return { [field]: false };

        // ===== Array/List Operators =====
        case 'has':
          return { [field]: { has: value } };

        case 'hasSome':
          const someValues = Array.isArray(value) ? value : [value];
          return { [field]: { hasSome: someValues } };

        case 'hasEvery':
          const everyValues = Array.isArray(value) ? value : [value];
          return { [field]: { hasEvery: everyValues } };

        case 'isEmpty':
          return { [field]: { equals: [] } };

        // ===== Date Operators =====
        case 'month':
        case 'day':
        case 'year':
        case 'before':
        case 'after':
          return { [field]: parsed };

        case 'dateRange':
          if (!Array.isArray(value) || value.length !== 2) {
            throw new BadRequestException(
              `'dateRange' operator requires array with 2 dates: [startDate, endDate]`,
            );
          }
          const startDate = new Date(value[0]);
          const endDate = new Date(value[1]);
          endDate.setHours(23, 59, 59, 999);
          return {
            [field]: {
              gte: startDate,
              lte: endDate,
            },
          };

        // ===== JSON Operators =====
        case 'jsonContains':
          return { [field]: { path: ['$'], equals: value } };

        case 'jsonHas':
          return { [field]: { path: [value], not: undefined } };

        // ===== Full-Text Search =====
        case 'search':
          // For MongoDB full-text search, create a text index on the field
          // This is a basic implementation using contains
          // For production, use MongoDB's $text and $search operators
          return { [field]: { contains: value, mode: 'insensitive' } };

        // ===== Case-Sensitive String Operators =====
        case 'exactContains':
          return { [field]: { contains: value, mode: 'default' } };

        case 'exactStartsWith':
          return { [field]: { startsWith: value, mode: 'default' } };

        case 'exactEndsWith':
          return { [field]: { endsWith: value, mode: 'default' } };

        // ===== Regex (MongoDB native support) =====
        case 'regex':
          // MongoDB has native regex support
          return { [field]: { contains: value } };

        default:
          return { [field]: { equals: parsed } };
      }
    };

    const andConditions = buildGroup(decoded.and || {});
    const orConditions = buildGroup(decoded.or || []);
    const notConditions = decoded.not ? buildGroup(decoded.not) : [];

    const query: any = {};
    if (andConditions.length > 0) query.AND = andConditions;
    if (orConditions.length > 0) query.OR = orConditions;
    if (notConditions.length > 0) query.NOT = notConditions;

    return query;
  } catch (e) {
    console.error('Filter parsing error:', e);
    throw new BadRequestException(`Invalid filter format: ${e.message}`);
  }
}

export const extractFieldValue = (
  filter: any,
  fieldName: string,
): string | null => {
  if (!filter) return null;

  const filterObj = JSON.parse(filter.replace(/'/g, '"'));

  let extractedValue: string | null = null;

  const findFieldValue = (obj: any): void => {
    if (obj === null || typeof obj !== 'object' || extractedValue !== null) {
      return; // Stop searching if already found
    }

    if (Array.isArray(obj)) {
      obj.forEach((item) => findFieldValue(item));
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      // Check if this key contains our field name with any operator
      // Examples: businessId__like, businessId__eq, roles.businessRoles.businessId__like
      const keyContainsField =
        key.includes(fieldName + '__') ||
        key === fieldName ||
        key.endsWith('.' + fieldName) ||
        key.includes('.' + fieldName + '__');

      if (keyContainsField) {
        extractedValue = value as string;
        return; // Found it, stop searching
      }

      // Recursively search nested objects
      findFieldValue(value);
    }
  };

  findFieldValue(filterObj);
  return extractedValue;
};

/**
 * Converts sort string to MongoDB/Mongoose orderBy
 * Format: ['+field1', '-field2'] or '+field1' or '-field1'
 * Also supports: ['field1:asc', 'field2:desc']
 */
// export function sortParamsDecoder(sort: string): any {
//   try {
//     if (!sort || sort.length === 0) return undefined;

//     const decoded = sort.startsWith('[') ? JSON.parse(sort.replace(/'/g, '"')) : [sort];

//     const sortFormat: any[] = [];

//     decoded.forEach((item: string) => {
//       // Support both '+field' and 'field:asc' formats
//       if (item.includes(':')) {
//         const [fieldName, order] = item.split(':');
//         sortFormat.push({ [fieldName]: order.toLowerCase() });
//       } else {
//         const sortOrder = item.startsWith('+') ? 'asc' : 'desc';
//         const fieldName = item.substring(1);
//         sortFormat.push({ [fieldName]: sortOrder });
//       }
//     });

//     console.log('sortFormat', sortFormat);

//     return sortFormat.length === 1 ? sortFormat[0] : sortFormat;
//   } catch (error) {
//     console.error('Sort parsing error:', error);
//     throw new BadRequestException('Bad sort format');
//   }
// }

export function sortParamsDecoder(sort: string): any {
  try {
    if (!sort || sort.length === 0) return undefined;

    const decoded: string[] = sort.startsWith('[')
      ? JSON.parse(sort.replace(/'/g, '"'))
      : sort.split(',');

    const sortFormat: any[] = [];

    decoded.forEach((item: string) => {
      // Support format: field:asc or field:desc
      if (item.includes(':')) {
        const [fieldName, order] = item.split(':');
        sortFormat.push({ [fieldName.trim()]: order.trim().toLowerCase() });
      }
      // Support: +field or -field
      else if (item.startsWith('+') || item.startsWith('-')) {
        const sortOrder = item.startsWith('+') ? 'asc' : 'desc';
        const fieldName = item.slice(1);
        sortFormat.push({ [fieldName.trim()]: sortOrder });
      }
      // Default: assume ascending
      else {
        sortFormat.push({ [item.trim()]: 'asc' });
      }
    });

    return sortFormat.length === 1 ? sortFormat[0] : sortFormat;
  } catch (error) {
    console.error('Sort parsing error:', error);
    throw new BadRequestException('Bad sort format');
  }
}

/**
 * Validates that filter fields are in the allowed list
 */
export function getNonFilterableFields(
  filters: any,
  allowedFields: string[],
): void {
  if (!filters || allowedFields.length === 0) return;

  const nonFilterableFields: string[] = [];

  const checkFields = (filter: any) => {
    Object.keys(filter).forEach((key) => {
      if (key === 'OR' || key === 'AND' || key === 'NOT') {
        // MongoDB logical operators
        if (Array.isArray(filter[key])) {
          filter[key].forEach((subFilter: any) => checkFields(subFilter));
        } else {
          checkFields(filter[key]);
        }
      } else if (!allowedFields.includes(key)) {
        nonFilterableFields.push(key);
      }
    });
  };

  checkFields(filters);

  if (nonFilterableFields.length > 0) {
    const message =
      nonFilterableFields.length === 1
        ? `Field is not filterable: ${nonFilterableFields[0]}`
        : `Fields are not filterable: ${nonFilterableFields.join(', ')}`;
    throw new BadRequestException(message);
  }
}

export const queryToPagination = (query: {
  page: string;
  length: string;
}): PaginationData => {
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.length) || 10;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  return {
    request: { skip, limit },
  };
};

export const resultToPagination = (
  totalItems: number,
  pagination: PaginationData,
): PaginationData => {
  const currentPage =
    pagination?.request?.skip / pagination?.request?.limit + 1 || 1;
  const pageSize = pagination?.request?.limit || 10;

  pagination.pagination = {
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage,
    pageSize,
  };

  return pagination;
};

/**
 * Helper function to build complex nested queries
 * Example: buildNestedQuery(['user', 'profile', 'name'], 'John')
 * Returns: { user: { profile: { name: 'John' } } }
 */
export function buildNestedQuery(path: string[], value: any): any {
  if (path.length === 0) return value;
  const [first, ...rest] = path;
  return { [first]: buildNestedQuery(rest, value) };
}

/**
 * Merge multiple where clauses
 */
export function mergeWhereClause(...clauses: any[]): any {
  const nonEmpty = clauses.filter((c) => c && Object.keys(c).length > 0);

  if (nonEmpty.length === 0) return {};
  if (nonEmpty.length === 1) return nonEmpty[0];

  return { AND: nonEmpty };
}

/**
 * Example usage of advanced filters:
 *
 * 1. Date range:
 *    filter={"and":{"createdAt__dateRange":["2025-01-01","2025-01-31"]}}
 *
 * 2. Between numbers:
 *    filter={"and":{"age__between":[18,65]}}
 *
 * 3. Array operations:
 *    filter={"and":{"tags__hasSome":["typescript","nodejs"]}}
 *
 * 4. NULL checks:
 *    filter={"and":{"deletedAt__isNull":true}}
 *
 * 5. NOT conditions:
 *    filter={"not":{"status__eq":"deleted"}}
 *
 * 6. Complex OR with AND:
 *    filter={"and":{"status__eq":"active"},"or":[{"role__eq":"admin"},{"role__eq":"moderator"}]}
 *
 * 7. String operations:
 *    filter={"and":{"email__endsWith":"@gmail.com","name__startsWith":"John"}}
 *
 * 8. Array isEmpty:
 *    filter={"and":{"tags__isEmpty":true}}
 *
 * 9. Before/After dates:
 *    filter={"and":{"createdAt__after":"2025-01-01","updatedAt__before":"2025-12-31"}}
 */
