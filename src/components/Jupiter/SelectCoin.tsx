import { useRef, useMemo, useState } from "react";
import { ButtonModal } from "../Buttons";
import { useJupiterApiContext } from "../../contexts";
import { TokenInfo } from "@solana/spl-token-registry";
import { useVirtualList } from "ahooks";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { nanoid } from "nanoid";

const Row = ({ info }: { info: TokenInfo }) => {
  return (
    <div className="flex flex-row justify-start items-center p-3 hover:bg-base-300 cursor-pointer hover:rounded-md">
      <div>
        <img src={info.logoURI} className="h-[35px]" />
      </div>
      <div className="flex flex-col ml-3">
        <span className="text-md font-bold">{info.symbol}</span>
        <span className="text-sm opacity-80">{info.name}</span>
      </div>
    </div>
  );
};

const Coin = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <img src={tokenInfo?.logoURI} className="h-[25px]" />
      <div className="flex flex-row items-center">
        <span className="text-lg font-bold text-white ml-4">
          {tokenInfo.symbol}
        </span>
        <ChevronDownIcon className="w-[20px] text-grey ml-2" />
      </div>
    </div>
  );
};

const TOP_COINS = [
  "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp", // FIDA
  "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", // SRM
  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E", // BTC
  "So11111111111111111111111111111111111111112", // wSOL
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // RAY
  "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac", // Mango
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
];

const TopCoin = ({
  token,
  setCoin,
  id,
}: {
  token: TokenInfo;
  setCoin: React.Dispatch<React.SetStateAction<TokenInfo | null | undefined>>;
  id: string;
}) => {
  return (
    <label
      onClick={() => setCoin(token)}
      htmlFor={`modal-select-${id}`}
      className="m-1 flex flex-row p-2 border border-[#E4E9EE] rounded-[5px] border-opacity-50 hover:bg-[#E4E9EE] hover:bg-opacity-10 cursor-pointer"
    >
      <img className="w-[18px] h-[18px] mr-2" src={token.logoURI} />
      <span className="text-white text-xs font-bold">{token.symbol}</span>
    </label>
  );
};

export const SelectCoin = ({
  tokenInfo,
  setCoin,
}: {
  tokenInfo: TokenInfo | null | undefined;
  setCoin: React.Dispatch<React.SetStateAction<TokenInfo | null | undefined>>;
}) => {
  const id = useRef(nanoid());
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const { tokenMap } = useJupiterApiContext();
  const [search, setSearch] = useState("");

  const originalList = useMemo(
    () =>
      Array.from(tokenMap.values()).filter(
        (e) =>
          e.address.includes(search) ||
          e.name.includes(search) ||
          e.symbol.includes(search)
      ),
    [search, tokenInfo]
  );

  const topList = originalList.filter((e) => TOP_COINS.includes(e.address));

  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 70,
    overscan: 10,
  });

  if (!tokenInfo) {
    return null;
  }

  return (
    <ButtonModal
      id={`select-${id.current}`}
      buttonClass="bg-transparent border-0 hover:bg-white hover:bg-opacity-10"
      buttonText={<Coin tokenInfo={tokenInfo} />}
      modalClass="h-screen overflow-clip"
    >
      <input
        value={search || ""}
        onChange={(e) => setSearch(e.target.value.trim())}
        type="text"
        id="search-token"
        placeholder="Search"
        className="w-full text-xs sm:text-md input input-bordered input-info mb-3"
        spellCheck={false}
      />

      <div className="flex flex-row justify-start flex-wrap">
        {topList.map((e) => (
          <TopCoin setCoin={setCoin} token={e} id={id.current} />
        ))}
      </div>

      <div className="border-[0.5px] mt-2 border-[#E4E9EE] border-opacity-50" />

      <div
        ref={containerRef}
        className="h-full min-h-[200px] overflow-scroll overscroll-contain"
      >
        <div ref={wrapperRef}>
          {list.map((e) => (
            <label
              key={e.index}
              htmlFor={`modal-select-${id.current}`}
              onClick={() => setCoin(e.data)}
            >
              <Row info={e.data} />
            </label>
          ))}
        </div>
      </div>
    </ButtonModal>
  );
};
