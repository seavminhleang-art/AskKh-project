import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/Table';

export default function ManagementTable({ columns = [], children, caption }) {
  return (
    <Table>
      {caption && <caption className="sr-only">{caption}</caption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => <TableHead key={column.key || column.label}>{column.label}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}
