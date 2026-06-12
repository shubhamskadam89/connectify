import React from 'react';
import { Link } from 'react-router-dom';
import type { PersonSummary } from '../types';
import { Avatar } from '../../../shared/components/Avatar';
import { formatDisplayName } from '../../../shared/utils/formatters';
import { ChevronRight } from 'lucide-react';

interface PeopleListProps {
  people: PersonSummary[];
  emptyLabel?: string;
  actionButton?: (person: PersonSummary) => React.ReactNode;
}

export const PeopleList: React.FC<PeopleListProps> = ({
  people,
  emptyLabel = 'No users found.',
  actionButton,
}) => {
  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[8px] border border-dashed border-brand-border bg-brand-surface p-8 text-center text-sm leading-[22px] text-brand-text-secondary">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-brand-border bg-brand-surface divide-y divide-brand-border">
      {people.map((person) => {
        const displayName = formatDisplayName({
          username: person.userName,
          firstName: person.firstName,
          lastName: person.lastName,
        });

        return (
          <div
            key={person.id}
            className="flex min-h-[64px] items-center justify-between gap-4 px-4 py-3 hover:bg-brand-surface-hover transition-colors duration-150"
          >
            {/* Clickable Area Link */}
            <Link
              to={`/u/${person.userName}`}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Avatar
                src={person.profileImageUrl}
                name={displayName}
                size="md"
              />
              <div className="min-w-0 text-left">
                <h5 className="truncate text-sm font-semibold leading-[20px] text-brand-text-primary hover:underline underline-offset-2">
                  {displayName}
                </h5>
                <p className="truncate text-xs leading-[16px] text-brand-text-secondary">
                  @{person.userName}
                </p>
              </div>
            </Link>

            {/* Right Side: Optional Action Button or Default Arrow Link */}
            <div className="shrink-0 flex items-center gap-2">
              {actionButton ? (
                actionButton(person)
              ) : (
                <Link
                  to={`/u/${person.userName}`}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-brand-text-muted hover:bg-brand-surface-muted hover:text-brand-text-primary transition-colors"
                  aria-label={`View @${person.userName}'s profile`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
