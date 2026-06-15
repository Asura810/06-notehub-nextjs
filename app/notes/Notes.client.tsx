'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Pagination from '@/components/Pagination/Pagination';

export default function NotesClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        perPage: 9,
      }),

    placeholderData: prev => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div>
      <SearchBox onChange={setSearch} />

      <button onClick={() => setIsModalOpen(true)}>Create note</button>

      <NoteList notes={notes} />

      {totalPages > 1 && <Pagination page={page} pageCount={totalPages} setPage={setPage} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
