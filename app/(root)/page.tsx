import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import {redirect} from "next/navigation";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {defaultUser} from "@/store/global";

const banks = [
  {
    $id: "bank_001",
    accountId: "acc_001",
    bankId: "bank_001",
    accessToken: "access_token_001",
    fundingSourceUrl: "https://bank1.com/funding-source",
    userId: "user_001",
    sharableId: "share_001",
    id: "acc_001",
    availableBalance: 1500.75,
    currentBalance: 1600.0,
    officialName: "Checking Account",
    mask: "1234",
    institutionId: "bank_001",
    name: "Bank 1 Checking",
    type: "checking",
    subtype: "personal",
    appwriteItemId: "item_001",
  },
  {
    $id: "bank_002",
    accountId: "acc_002",
    bankId: "bank_002",
    accessToken: "access_token_002",
    fundingSourceUrl: "https://bank2.com/funding-source",
    userId: "user_002",
    sharableId: "share_002",
    id: "acc_002",
    availableBalance: 2500.5,
    currentBalance: 2600.0,
    officialName: "Savings Account",
    mask: "5678",
    institutionId: "bank_002",
    name: "Bank 2 Savings",
    type: "savings",
    subtype: "personal",
    appwriteItemId: "item_002",
  },
];

export default async function Home() {
  const user = await getLoggedInUser();

  if (user === defaultUser) {
    // Redirect to sign-in if user is defaultUser
    redirect("/sign-in");
  }


  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user.name}
            subtext="Access and manage account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
      </div>
      <RightSidebar user={user} transactions={[]} banks={banks} />
    </section>
  );
}
