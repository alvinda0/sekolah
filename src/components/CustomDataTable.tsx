// components/CustomDataTable.tsx
import React from "react";
import DataTable, { TableProps } from "react-data-table-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom styles untuk glassmorphism theme
const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
      borderRadius: "16px",
      border: "1px solid rgba(30, 58, 138, 0.2)",
    },
  },
  headRow: {
    style: {
      backgroundColor: "rgba(30, 58, 138, 0.1)",
      backdropFilter: "blur(12px)",
      borderBottom: "2px solid rgba(30, 58, 138, 0.3)",
      minHeight: "46px",
    },
  },
  headCells: {
    style: {
      color: "#1e3a8a",
      fontSize: "14px",
      fontWeight: "700",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      paddingLeft: "16px",
      paddingRight: "16px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(30,58,138,0.1) 100%)",
      backdropFilter: "blur(8px)",
      borderRight: "1px solid rgba(30, 58, 138, 0.15)",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
      borderBottom: "1px solid rgba(30, 58, 138, 0.15)",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(8px)",
      color: "#374151",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(30, 58, 138, 0.08) !important",
        backdropFilter: "blur(12px) !important",
        transform: "scale(1.005)",
        boxShadow: "0 4px 12px rgba(30, 58, 138, 0.15)",
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "rgba(0, 123, 255, 0.08)",
      backdropFilter: "blur(12px)",
      borderBottomColor: "rgba(255, 255, 255, 0.3)",
      outline: "none",
    },
  },
  cells: {
    style: {
      color: "#374151",
      padding: "12px 16px",
      fontWeight: "500",
      borderRight: "1px solid rgba(30, 58, 138, 0.1)",
    },
  },
  pagination: {
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(12px)",
      color: "#374151",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "0 0 16px 16px",
      minHeight: "64px",
      padding: "8px 16px",
    },
    pageButtonsStyle: {
      borderRadius: "10px",
      height: "36px",
      width: "36px",
      padding: "4px",
      margin: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "#374151",
      fill: "#374151",
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(0, 123, 255, 0.15)",
        borderColor: "rgba(0, 123, 255, 0.3)",
        transform: "scale(1.05)",
        boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)",
      },
      "&:disabled": {
        color: "#9ca3af",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        cursor: "not-allowed",
        opacity: 0.5,
      },
      "&:focus": {
        outline: "2px solid rgba(0, 123, 255, 0.4)",
        outlineOffset: "2px",
      },
    },
  },
  noData: {
    style: {
      color: "#6b7280",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(12px)",
      padding: "48px 24px",
      fontSize: "16px",
      fontWeight: "600",
    },
  },
  progress: {
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(12px)",
    },
  },
};

interface CustomDataTableProps<T> extends Omit<TableProps<T>, 'customStyles'> {
  title?: string;
  description?: string;
}

const CustomDataTable = <T,>({
  title,
  description,
  ...props
}: CustomDataTableProps<T>) => {
  return (
    <Card
      className="pb-0 border-white/40 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {(title || description) && (
        <CardHeader
          className="relative overflow-hidden"
        >

          {title && (
            <CardTitle className="text-gray-800 text-xl font-bold flex items-center gap-3">
              {title}
            </CardTitle>
          )}
          {description && (
            <p className="text-gray-600 text-sm font-medium mt-2">
              {description}
            </p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div
          className="overflow-x-auto overflow-y-hidden custom-scrollbar"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(0,123,255,0.03) 100%)",
          }}
        >
          <DataTable
            {...props}
            customStyles={customStyles}
            responsive
            highlightOnHover
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            noDataComponent={
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#007BFF]/20 to-[#A0F000]/20 flex items-center justify-center backdrop-blur-sm border border-white/40">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-bold text-lg">No Data Available</p>
                <p className="text-gray-500 text-sm mt-1">There are no records to display</p>
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomDataTable;