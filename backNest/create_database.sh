curl -G -d 'login42=aperin' -d 'username=hdelmas' localhost:3000/user/add
curl -G -d 'login42=lbonnefo' -d 'username=hdelmas2' localhost:3000/user/add
curl -G -d 'login42=yooo' -d 'username=hdelmas3' localhost:3000/user/add
curl -G -d 'login42=lyaiche' -d 'username=hdelmas1' localhost:3000/user/add
curl -G -d 'login42=yhuberla' -d 'username=yann' localhost:3000/user/add

# curl localhost:3000/user/addWin:alexis
# curl localhost:3000/user/addLoss:yann

curl -G -d 'player1=alexis' -d 'player2=hugo' -d 'score1=0' -d 'score2=15' localhost:3000/match/add
curl -G -d 'player1=alexis' -d 'player2=lucas' -d 'score1=3' -d 'score2=5' localhost:3000/match/add
curl -G -d 'player1=lars' -d 'player2=lucas' -d 'score1=3' -d 'score2=8' localhost:3000/match/add
curl -G -d 'player1=lars' -d 'player2=lucas' -d 'score1=3' -d 'score2=2' localhost:3000/match/add
curl -G -d 'player1=lars' -d 'player2=hugo' -d 'score1=3' -d 'score2=4' localhost:3000/match/add
curl -G -d 'player1=lars' -d 'player2=hugo' -d 'score1=3' -d 'score2=3' localhost:3000/match/add
curl -G -d 'player1=lars' -d 'player2=yann' -d 'score1=8' -d 'score2=0' localhost:3000/match/add
curl -G -d 'player1=hugo' -d 'player2=yann' -d 'score1=8' -d 'score2=6' localhost:3000/match/add
curl -G -d 'player1=lucas' -d 'player2=yann' -d 'score1=8' -d 'score2=7' localhost:3000/match/add
curl -G -d 'player1=lucas' -d 'player2=yann' -d 'score1=10' -d 'score2=9' localhost:3000/match/add
curl -G -d 'player1=lucas' -d 'player2=hugo' -d 'score1=10' -d 'score2=4' localhost:3000/match/add

curl -G -d 'f1=lars' -d 'f2=hugo' localhost:3000/user/set_friends
curl -G -d 'f1=lars' -d 'f2=alexis' localhost:3000/user/set_friends
curl -G -d 'f1=lars' -d 'f2=yann' localhost:3000/user/set_friends
curl -G -d 'f1=lars' -d 'f2=lucas' localhost:3000/user/set_friends
curl -G -d 'f1=hugo' -d 'f2=alexis' localhost:3000/user/set_friends
curl -G -d 'f1=alexis' -d 'f2=lucas' localhost:3000/user/set_friends
