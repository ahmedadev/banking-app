import { useState ,useEffect, useCallback} from 'react';
import { Button } from "./ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { StyledString } from 'next/dist/build/swc';
import { useRouter } from 'next/navigation';
import { CreateLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
	const [token, setToken] = useState("")
	const router=useRouter()
	useEffect(() => {
		const getLinkToken = async ()=> {
			const data =await CreateLinkToken(user)
			setToken(data?.linkToken)
		}
		getLinkToken()
		}, [user])
	const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
		await exchangePublicToken({
      publicToken: public_token,
      user,
    });
		router.push("/")
	}, [user])
	const config: PlaidLinkOptions= {
		token,
		onSuccess
	}
	const {open,ready}=usePlaidLink(config)
  return (
    <>
      {variant === "primary" ? (
        <Button className="plaidlink-primary" onClick={()=>open()} disabled={!ready}>Connect bank</Button>
      ) : variant === "ghost" ? (
        <Button>Connect bank</Button>
      ) : (
        <Button>Connect bank</Button>
      )}
    </>
  );
};
export default PlaidLink;
