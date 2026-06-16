import React, { useState } from 'react';
import AppInput from './AppInput';
import AppSelect from './AppSelect';
import AppButton from './AppButton';
import { Search } from 'lucide-react';
import EmptyState from './EmptyState';
import { HelpCircle } from 'lucide-react';

interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (val: any, row: T) => React.ReactNode;
}

interface AppTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filterKey?: keyof T;
  filterOptions?: { value: string; label: string }[];
  filterPlaceholder?: string;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AppTable<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  filterKey,
  filterOptions,
  filterPlaceholder = 'All options',
  pageSize = 5,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search query.'
}: AppTableProps<T>) {
  const [query, setQuery] = useState('');
  const [filterVal, setFilterVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Apply search query and filter selection
  const filteredData = data.filter(row => {
    const matchesSearch = searchKey && query
      ? String(row[searchKey]).toLowerCase().includes(query.toLowerCase())
      : true;

    const matchesFilter = filterKey && filterVal
      ? String(row[filterKey]) === filterVal
      : true;

    return matchesSearch && matchesFilter;
  });

  // Pagination bounds
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 w-full text-left font-sans">
      {/* Controls: Search and Filters */}
      {(searchKey || (filterKey && filterOptions)) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full">
          {searchKey && (
            <div className="w-full sm:max-w-xs">
              <AppInput
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          )}
          {filterKey && filterOptions && (
            <div className="w-full sm:max-w-xs">
              <AppSelect
                value={filterVal}
                onChange={e => {
                  setFilterVal(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{filterPlaceholder}</option>
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </AppSelect>
            </div>
          )}
        </div>
      )}

      {/* Table Element */}
      {totalItems === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="w-full border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60">
              <thead className="bg-slate-50/70">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider select-none"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {columns.map((col) => {
                      const cellVal = (row as any)[col.key];
                      return (
                        <td
                          key={col.key}
                          className="px-6 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap"
                        >
                          {col.render ? col.render(cellVal, row) : String(cellVal ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          {totalPages > 1 && (
            <div className="px-6 py-3.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-400 font-semibold select-none">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} entries
              </span>
              <div className="flex space-x-1.5">
                <AppButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  className="!h-9 px-3 text-xs rounded-lg active:scale-95"
                >
                  Prev
                </AppButton>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = pNum === currentPage;
                  return (
                    <AppButton
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      variant={isActive ? 'primary' : 'secondary'}
                      className={`!h-9 !w-9 !p-0 text-xs rounded-lg active:scale-95`}
                    >
                      {pNum}
                    </AppButton>
                  );
                })}
                <AppButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  className="!h-9 px-3 text-xs rounded-lg active:scale-95"
                >
                  Next
                </AppButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AppTable;
