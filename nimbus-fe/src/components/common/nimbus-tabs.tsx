import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

interface NimbusTabsProps {
  items: {
    label: string;
    path: string;
  }[];
  className?: string;
}

export default function NimbusTabs({ items, className }: NimbusTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getDefaultValue = () => {
    const path = pathname.split("/").pop();
    return items.find((item) => item.path.includes(path as string))?.path;
  };

  return (
    <Tabs defaultValue={getDefaultValue()} className={cn("w-full", className)}>
      <TabsList>
        {items.map((item) => (
          <TabsTrigger
            key={item.path}
            value={item.path}
            onClick={() => {
              router.push(item.path);
            }}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
