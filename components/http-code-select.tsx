"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HTTP_STATUS_DESCRIPTIONS } from "@/types/http-status";

interface HttpCodeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const codeGroups = {
  "1xx - Informational": [100, 101, 102, 103],
  "2xx - Success": [200, 201, 202, 203, 204, 206, 207],
  "3xx - Redirection": [300, 301, 302, 303, 304, 307, 308],
  "4xx - Client Error": [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 418, 422, 429, 451],
  "5xx - Server Error": [500, 501, 502, 503, 504, 505, 507, 508, 511],
};

export function HttpCodeSelect({
  value,
  onValueChange,
  disabled,
}: HttpCodeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="font-mono">
        <SelectValue placeholder="Select HTTP code..." />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(codeGroups).map(([group, codes]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {codes.map((code) => (
              <SelectItem key={code} value={String(code)} className="font-mono">
                {code} - {HTTP_STATUS_DESCRIPTIONS[code] ?? "Unknown"}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
