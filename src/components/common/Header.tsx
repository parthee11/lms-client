import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../app/features/auth/authSelectors";
import { setIsAuthenticated } from "../../app/features/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LogIn, LogOut, Plus, School } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface HeaderProps {
  isAdmin: boolean;
}

const Header = ({ isAdmin }: HeaderProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userProfile = useSelector(selectUser);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(setIsAuthenticated(false));
  };

  return (
    <header className="p-2">
      <Card>
        <CardHeader className="p-2 pl-4">
          <CardTitle className="flex justify-between">
            <Link to="/dashboard" className="flex gap-2 items-center">
              <School className="h-6 w-6" />
              <h1 className="font-bold text-2xl">SchoolGeniuz</h1>
            </Link>
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <>
                {isAdmin ? (
                  <Link
                    to="/login"
                    className={`${buttonVariants({ variant: "outline" })}`}
                  >
                    User <LogIn className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/admin-login"
                    className={`${buttonVariants({ variant: "outline" })}`}
                  >
                    Admin <LogIn className="h-4 w-4" />
                  </Link>
                )}
              </>
            )}
          </CardTitle>
        </CardHeader>
        {isAuthenticated && (
          <CardContent className="p-2 pt-0">
            <NavigationMenu className="list-none">
              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Link to="/users">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Students
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Link to="/batches">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Batches
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link
                  to={userProfile?.role === "admin" ? "/tests" : "/my-tests"}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {userProfile?.role === "admin" ? "Tests" : "My Tests"}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">Create <Plus className="w-4 h-4" /></Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[200px]">
                      <ul>
                        <li>
                          <Link
                            to="/create?type=batch"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            Batch
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=question"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            Question
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=user"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            Student
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=test"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            Test
                          </Link>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </NavigationMenuItem>
              )}
            </NavigationMenu>
          </CardContent>
        )}
      </Card>
    </header>
  );
};

export default Header;
