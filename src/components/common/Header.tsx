import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../app/features/auth/authSelectors";
import { setIsAuthenticated } from "../../app/features/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Globe, LogIn, LogOut, Plus, School } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  isAdmin: boolean;
}

const convertLangCodeToLanguage = (
  code: string,
) => {
  switch (code) {
    case "ta":
      return "தமிழ்";
    case "en":
    default:
      return "English";
  }
};

const Header = ({ isAdmin }: HeaderProps) => {
  const { t, i18n } = useTranslation();
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
              <h1 className="font-bold text-2xl">{t("lms")}</h1>
            </Link>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={"outline"}>
                    <Globe className="h-4 w-4" />
                    <span className="capitalize">
                      {convertLangCodeToLanguage(i18n.language)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage("ta")}>
                    தமிழ்
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout}>
                  {t("logout")} <LogOut className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  {isAdmin ? (
                    <Link
                      to="/login"
                      className={`${buttonVariants({ variant: "outline" })}`}
                    >
                      {t("user")} <LogIn className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/admin-login"
                      className={`${buttonVariants({ variant: "outline" })}`}
                    >
                      {t("admin")} <LogIn className="h-4 w-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {isAuthenticated && (
          <CardContent className="p-2 pt-0">
            <NavigationMenu className="list-none">
              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Link to="/batches">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t("batches")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Link to="/users">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t("students")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link
                  to={userProfile?.role === "admin" ? "/tests" : "/my-tests"}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {userProfile?.role === "admin" ? t("tests") : t("my_tests")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {userProfile?.role === "admin" && (
                <NavigationMenuItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">
                        {t("create")} <Plus className="w-4 h-4" />
                      </Button>
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
                            {t("batch")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=question"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            {t("question")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=user"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            {t("student")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create?type=test"
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} w-full !inline-block`}
                          >
                            {t("test")}
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
