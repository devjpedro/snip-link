type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date?: string;
      hour?: string;
      clicks: number;
    };
  }>;
  label?: string;
  labelKey?: "date" | "hour";
  labelText?: string;
  valueText?: string;
};

export const CustomChartTooltip = ({
  active,
  payload,
  labelKey,
  labelText = "Data",
  valueText = "Cliques",
}: CustomTooltipProps) => {
  if (!(active && payload) || payload.length === 0) return null;

  const data = payload[0];

  const displayLabel = labelKey
    ? data?.payload[labelKey]
    : data?.payload.date || data?.payload.hour || "";

  return (
    <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
      <div className="flex flex-col gap-1.5">
        <p className="font-medium text-sm">
          {labelText}:{" "}
          <span className="font-normal text-muted-foreground">
            {displayLabel}
          </span>
        </p>
        <p className="font-medium text-primary text-sm">
          {valueText}: <span className="font-normal">{data?.value}</span>
        </p>
      </div>
    </div>
  );
};
