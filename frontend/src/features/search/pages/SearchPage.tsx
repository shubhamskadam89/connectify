import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApi } from '../api/search';
import type { PersonSummary } from '../../social-graph/types';
import { PeopleList } from '../../social-graph/components/PeopleList';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Alert } from '../../../shared/components/Alert';
import { Search, Users } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState<'people' | 'posts' | 'tags'>('people');
  const [results, setResults] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(query);
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let ignore = false;
    async function executeSearch() {
      setLoading(true);
      setError('');
      try {
        const users = await searchApi.searchUsers(query);
        if (!ignore) {
          setResults(users);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to search users.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    executeSearch();

    return () => {
      ignore = true;
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  const handleTabChange = (tab: 'people' | 'posts' | 'tags') => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Search"
        description="Find connections, posts, and tags in the Connectify space."
      />

      {/* Search Submission Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-end w-full">
        <div className="flex-1 text-left">
          <Input
            label="Search keyword"
            type="text"
            placeholder="Type exact username (e.g. johndoe)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={loading} className="h-[42px] shrink-0 gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>

      {/* Filter Chips / Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3">
        <button
          onClick={() => handleTabChange('people')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            activeTab === 'people'
              ? 'bg-brand-text-primary text-white border-brand-text-primary'
              : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:text-brand-text-primary hover:border-brand-border-strong'
          }`}
        >
          People
        </button>
        <button
          onClick={() => handleTabChange('posts')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            activeTab === 'posts'
              ? 'bg-brand-text-primary text-white border-brand-text-primary'
              : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:text-brand-text-primary hover:border-brand-border-strong'
          }`}
        >
          Posts (Coming soon)
        </button>
        <button
          onClick={() => handleTabChange('tags')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            activeTab === 'tags'
              ? 'bg-brand-text-primary text-white border-brand-text-primary'
              : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:text-brand-text-primary hover:border-brand-border-strong'
          }`}
        >
          Tags (Coming soon)
        </button>
      </div>

      {error && <Alert message={error} type="error" onClose={() => setError('')} />}

      {/* Search Results Display */}
      {loading ? (
        <Skeleton.List count={3} />
      ) : activeTab !== 'people' ? (
        <EmptyState
          icon={<Search />}
          title={`${activeTab === 'posts' ? 'Posts' : 'Tags'} module coming soon`}
          description="This search index module is under development and will be enabled in the next version."
        />
      ) : query ? (
        results.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary leading-[18px]">
              Search Results
            </h3>
            <PeopleList people={results} emptyLabel="No users found matching search term." />
          </div>
        ) : (
          <EmptyState
            icon={<Users />}
            title="No connections found"
            description={`We couldn't find any user profile matching "@${query}". Double check the spelling of their username.`}
          />
        )
      ) : (
        <EmptyState
          icon={<Search />}
          title="Search Connectify network"
          description="Type a user's exact username above to find them and view their profile details."
        />
      )}
    </div>
  );
};
