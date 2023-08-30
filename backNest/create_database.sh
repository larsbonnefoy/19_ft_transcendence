curl -G -d 'login42=aperin' -d 'username=alexis' ${import.meta.env.VITE_BACK}/user/add
curl -G -d 'login42=lbonnefo' -d 'username=lars' ${import.meta.env.VITE_BACK}/user/add
curl -G -d 'login42=hdelmas' -d 'username=hugo' ${import.meta.env.VITE_BACK}/user/add
curl -G -d 'login42=lyaiche' -d 'username=lucas' ${import.meta.env.VITE_BACK}/user/add
curl -G -d 'login42=yhuberla' -d 'username=yann' ${import.meta.env.VITE_BACK}/user/add

# curl ${import.meta.env.VITE_BACK}/user/addWin:alexis
# curl ${import.meta.env.VITE_BACK}/user/addLoss:yann

curl -G -d 'player1=alexis' -d 'player2=hugo' -d 'score1=0' -d 'score2=15' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=alexis' -d 'player2=lucas' -d 'score1=3' -d 'score2=5' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lars' -d 'player2=lucas' -d 'score1=3' -d 'score2=8' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lars' -d 'player2=lucas' -d 'score1=3' -d 'score2=2' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lars' -d 'player2=hugo' -d 'score1=3' -d 'score2=4' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lars' -d 'player2=hugo' -d 'score1=3' -d 'score2=3' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=hugo' -d 'player2=yann' -d 'score1=8' -d 'score2=6' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lucas' -d 'player2=yann' -d 'score1=8' -d 'score2=7' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lucas' -d 'player2=yann' -d 'score1=10' -d 'score2=9' ${import.meta.env.VITE_BACK}/match/add
curl -G -d 'player1=lucas' -d 'player2=hugo' -d 'score1=10' -d 'score2=4' ${import.meta.env.VITE_BACK}/match/add

curl -G -d 'f1=lars' -d 'f2=hugo' ${import.meta.env.VITE_BACK}/user/set_friends
curl -G -d 'f1=lars' -d 'f2=hugo' ${import.meta.env.VITE_BACK}/user/unset_friends

curl -G -d 'f1=lars' -d 'f2=hugo' ${import.meta.env.VITE_BACK}/user/add_friend
curl -G -d 'f1=lars' -d 'f2=alexis' ${import.meta.env.VITE_BACK}/user/add_friend
curl -G -d 'f1=lars' -d 'f2=yann' ${import.meta.env.VITE_BACK}/user/add_friend
curl -G -d 'f1=lars' -d 'f2=lucas' ${import.meta.env.VITE_BACK}/user/add_friend
curl -G -d 'f1=hugo' -d 'f2=alexis' ${import.meta.env.VITE_BACK}/user/add_friend
curl -G -d 'f1=alexis' -d 'f2=lucas' ${import.meta.env.VITE_BACK}/user/add_friend

curl -G -d 'f1=hugo' -d 'f2=lars' ${import.meta.env.VITE_BACK}/user/accept_request
curl -G -d 'f1=alexis' -d 'f2=lars' ${import.meta.env.VITE_BACK}/user/accept_request
curl -G -d 'f1=yann' -d 'f2=lars' ${import.meta.env.VITE_BACK}/user/refuse_request
curl -G -d 'f1=alexis' -d 'f2=hugo' ${import.meta.env.VITE_BACK}/user/accept_request
curl -G -d 'f1=lucas' -d 'f2=alexis' ${import.meta.env.VITE_BACK}/user/accept_request

curl -G -d 'f1=lucas' -d 'f2=yann' ${import.meta.env.VITE_BACK}/user/block_user