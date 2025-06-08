import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/zustand";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user?.image} alt={user?.name} />
      <AvatarFallback className="rounded-lg">
        {user?.name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
