import { createApp } from 'vue';

const app = createApp({
    data() {
        return {
            // Navigation
            currentPage: 'home',
            
            // Authentication
            isLoggedIn: false,
            showLoginModal: false,
            showRegisterModal: false,
            loginForm: { username: '', password: '' },
            registerForm: { 
                username: '', 
                email: '', 
                password: '', 
                confirmPassword: '',
                rank: '',
                role: '',
                agents: [],
                discord: '',
                about: '',
                availability: ''
            },
            loginError: '',
            registerError: '',
            currentUser: null,
            showUserMenu: false,
            
            // Create Post Modals
            showCreateLftModal: false,
            showCreateLfpModal: false,
            showCreateScrimModal: false,
            showCreateGroupModal: false,
            
            // Contact
            showContactModal: false,
            contactTarget: { id: null, type: null, name: '', discord: '' },
            contactForm: { message: '' },
            
            // Profile
            editMode: false,
            profileData: {
                username: '',
                rank: '',
                role: '',
                agents: [],
                discord: '',
                about: '',
                availability: ''
            },
            
            // My Posts
            myPostsTab: 'lft',
            
            // Filters
            filters: {
                rank: '',
                role: '',
                language: '',
                level: '',
                roleNeeded: '',
                date: '',
                size: ''
            },
            
            // Calendar for Scrims
            currentCalendarDate: new Date(),
            
            // Constants
            ranks: ['Iron 1', 'Iron 2', 'Iron 3', 'Bronze 1', 'Bronze 2', 'Bronze 3', 'Silver 1', 'Silver 2', 'Silver 3', 'Gold 1', 'Gold 2', 'Gold 3', 'Platinum 1', 'Platinum 2', 'Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Ascendant 1', 'Ascendant 2', 'Ascendant 3', 'Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant'],
            roles: ['Sentinel', 'Controller', 'Duelist', 'Initiator', 'Flex'],
            agents: ['Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Deadlock', 'Fade', 'Gekko', 'Harbor', 'Iso', 'Jett', 'KAY/O', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru'],
            languages: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'],
            levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Semi-Pro', 'Professionnel'],
            weekDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            
            // Forms
            lftForm: {
                title: '',
                rank: '',
                role: '',
                agents: [],
                language: 'Français',
                availability: '',
                description: ''
            },
            lfpForm: {
                teamName: '',
                level: '',
                roleNeeded: '',
                minRank: '',
                language: 'Français',
                practiceSchedule: '',
                description: ''
            },
            scrimForm: {
                teamName: '',
                date: this.formatDateForInput(new Date()),
                time: '19:00',
                level: '',
                format: 'BO1',
                description: ''
            },
            groupForm: {
                rank: '',
                playersNeeded: '1',
                gameMode: 'Competitive',
                language: 'Français',
                availability: '',
                description: ''
            },
            
            // Data Collections
            players: [],
            teams: [],
            scrims: [],
            groups: [],
            myLftPosts: [],
            myLfpPosts: [],
            myScrims: [],
            myGroups: [],
            userStats: {
                postsCount: 0,
                messagesCount: 0,
                joinedDate: ''
            },
            
            // API status
            isLoading: false,
            error: null,
            
            // Initialize missing arrays for recent activities
            recentPlayers: [],
            recentTeams: [],
        };
    },
    computed: {
        filteredPlayers() {
            return this.players.filter(player => {
                return (!this.filters.rank || player.rank === this.filters.rank) &&
                       (!this.filters.role || player.role === this.filters.role) &&
                       (!this.filters.language || player.language === this.filters.language);
            });
        },
        filteredTeams() {
            return this.teams.filter(team => {
                return (!this.filters.level || team.level === this.filters.level) &&
                       (!this.filters.roleNeeded || team.roleNeeded === this.filters.roleNeeded) &&
                       (!this.filters.language || team.language === this.filters.language);
            });
        },
        filteredScrims() {
            return this.scrims.filter(scrim => {
                return (!this.filters.level || scrim.level === this.filters.level) &&
                       (!this.filters.date || this.formatDateForInput(new Date(scrim.date)) === this.filters.date);
            });
        },
        filteredGroups() {
            return this.groups.filter(group => {
                return (!this.filters.size || group.playersNeeded.toString() === this.filters.size) &&
                       (!this.filters.rank || group.rank === this.filters.rank) &&
                       (!this.filters.language || group.language === this.filters.language);
            });
        },
        calendarDates() {
            // Generate dates for current week view
            const dates = [];
            const startDate = this.getStartOfWeek(this.currentCalendarDate);
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                dates.push(date);
            }
            
            return dates;
        },
        calendarTitle() {
            const startDate = this.calendarDates[0];
            const endDate = this.calendarDates[6];
            const startMonth = startDate.toLocaleString('fr-FR', { month: 'long' });
            const endMonth = endDate.toLocaleString('fr-FR', { month: 'long' });
            
            if (startMonth === endMonth) {
                return `${startMonth} ${startDate.getFullYear()}`;
            } else {
                return `${startMonth} - ${endMonth} ${startDate.getFullYear()}`;
            }
        }
    },
    methods: {
        // Navigation
        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu;
        },
        
        // Authentication
        async login() {
            this.isLoading = true;
            this.loginError = '';
            
            try {
                // In a real app, fetch from server
                if (this.loginForm.username === 'QMD France' && this.loginForm.password === 'Gv8!xP4@zW2#rT6$Lm9%qY7&bJ5^dN') {
                    // Admin login - would normally be authenticated against server
                    const adminUser = await this.fetchUserData('admin1');
                    this.currentUser = adminUser;
                    this.isLoggedIn = true;
                    this.showLoginModal = false;
                    this.loginForm = { username: '', password: '' };
                    
                    // Set profile data
                    this.profileData = { ...this.currentUser };
                    
                    // Load user-specific content
                    await this.loadUserContent();
                } else {
                    // This would normally check the database
                    this.loginError = 'Identifiants incorrects';
                }
            } catch (error) {
                this.loginError = 'Erreur lors de la connexion';
                console.error('Login error:', error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async register() {
            this.isLoading = true;
            this.registerError = '';
            
            try {
                if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password || 
                    !this.registerForm.rank || !this.registerForm.role) {
                    this.registerError = 'Tous les champs marqués * sont requis.';
                    return;
                }
                
                if (this.registerForm.password !== this.registerForm.confirmPassword) {
                    this.registerError = 'Les mots de passe ne correspondent pas.';
                    return;
                }
                
                // In a real app, this would send the data to the server
                const userId = 'user' + Date.now();
                const newUser = {
                    id: userId,
                    username: this.registerForm.username,
                    email: this.registerForm.email,
                    isOfficial: false,
                    rank: this.registerForm.rank,
                    role: this.registerForm.role,
                    agents: this.registerForm.agents,
                    discord: this.registerForm.discord,
                    about: this.registerForm.about,
                    availability: this.registerForm.availability,
                    createdAt: new Date()
                };
                
                // This would normally save to the database
                this.currentUser = newUser;
                this.isLoggedIn = true;
                this.showRegisterModal = false;
                
                // Reset form
                this.registerForm = { 
                    username: '', email: '', password: '', confirmPassword: '',
                    rank: '', role: '', agents: [], discord: '', about: '', availability: ''
                };
                
                // Set profile data
                this.profileData = { ...this.currentUser };
                
                // Set user stats for new user
                this.userStats = {
                    postsCount: 0,
                    messagesCount: 0,
                    joinedDate: this.formatDate(new Date())
                };
                
                // Initialize empty user content
                this.myLftPosts = [];
                this.myLfpPosts = [];
                this.myScrims = [];
                this.myGroups = [];
                
                alert('Compte créé avec succès!');
            } catch (error) {
                this.registerError = 'Erreur lors de l\'inscription';
                console.error('Registration error:', error);
            } finally {
                this.isLoading = false;
            }
        },
        logout() {
            this.isLoggedIn = false;
            this.currentUser = null;
            this.showUserMenu = false;
            this.currentPage = 'home';
        },
        
        // Formatters
        formatDate(date) {
            if (!date) return '';
            if (typeof date === 'string') date = new Date(date);
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
        formatScrimTime(time) {
            return time;
        },
        formatCalendarDate(date) {
            return date.getDate();
        },
        formatDateForInput(date) {
            if (!date) return '';
            if (typeof date === 'string') date = new Date(date);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
        formatTimeAgo(date) {
            if (!date) return '';
            const now = new Date();
            const pastDate = new Date(date);
            const diff = now - pastDate;
            
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
            if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        },
        
        // Filters
        resetFilters() {
            this.filters = {
                rank: '',
                role: '',
                language: '',
                level: '',
                roleNeeded: '',
                date: '',
                size: ''
            };
        },
        
        // Calendar
        getStartOfWeek(date) {
            const result = new Date(date);
            const day = result.getDay();
            const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
            result.setDate(diff);
            return result;
        },
        previousWeek() {
            const newDate = new Date(this.currentCalendarDate);
            newDate.setDate(newDate.getDate() - 7);
            this.currentCalendarDate = newDate;
        },
        nextWeek() {
            const newDate = new Date(this.currentCalendarDate);
            newDate.setDate(newDate.getDate() + 7);
            this.currentCalendarDate = newDate;
        },
        getScrimsForDate(date) {
            const dateString = this.formatDateForInput(date);
            return this.scrims.filter(scrim => this.formatDateForInput(new Date(scrim.date)) === dateString);
        },
        
        // View Details
        viewPlayerDetails(id) {
            const player = this.players.find(p => p.id === id);
            if (player) {
                this.contactTarget = {
                    id: player.id,
                    type: 'player',
                    name: player.username,
                    discord: player.discord
                };
                this.showContactModal = true;
            }
        },
        viewTeamDetails(id) {
            const team = this.teams.find(t => t.id === id);
            if (team) {
                this.contactTarget = {
                    id: team.id,
                    type: 'team',
                    name: team.name,
                    discord: team.discord
                };
                this.showContactModal = true;
            }
        },
        viewScrimDetails(id) {
            const scrim = this.scrims.find(s => s.id === id);
            if (scrim) {
                this.contactTarget = {
                    id: scrim.id,
                    type: 'scrim',
                    name: scrim.teamName,
                    discord: scrim.discord
                };
                this.showContactModal = true;
            }
        },
        
        // Contact
        contactPlayer(id) {
            const player = this.players.find(p => p.id === id);
            if (player) {
                this.contactTarget = {
                    id: player.id,
                    type: 'player',
                    name: player.username,
                    discord: player.discord
                };
                this.showContactModal = true;
            }
        },
        contactTeam(id) {
            const team = this.teams.find(t => t.id === id);
            if (team) {
                this.contactTarget = {
                    id: team.id,
                    type: 'team',
                    name: team.name,
                    discord: team.discord
                };
                this.showContactModal = true;
            }
        },
        contactScrimTeam(id) {
            const scrim = this.scrims.find(s => s.id === id);
            if (scrim) {
                this.contactTarget = {
                    id: scrim.id,
                    type: 'scrim',
                    name: scrim.teamName,
                    discord: scrim.discord
                };
                this.showContactModal = true;
            }
        },
        contactGroup(id) {
            const group = this.groups.find(g => g.id === id);
            if (group) {
                this.contactTarget = {
                    id: group.id,
                    type: 'group',
                    name: `Groupe de ${group.currentSize}/5`,
                    discord: group.discord
                };
                this.showContactModal = true;
            }
        },
        sendMessage() {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            if (!this.contactForm.message) {
                alert('Veuillez entrer un message');
                return;
            }
            
            // In a real app, we would send this to the server
            alert(`Message envoyé à ${this.contactTarget.name}`);
            this.contactForm.message = '';
            this.showContactModal = false;
            
            // For demo purposes, increment messages count
            this.userStats.messagesCount++;
        },
        
        // Profile
        saveProfile() {
            // In a real app, we would send this to the server
            this.currentUser = { ...this.profileData };
            this.editMode = false;
            alert('Profil mis à jour avec succès');
        },
        cancelEdit() {
            this.profileData = { ...this.currentUser };
            this.editMode = false;
        },
        
        // Post Actions
        createLftPost() {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Validate form
            if (!this.lftForm.title || !this.lftForm.rank || !this.lftForm.role || !this.lftForm.description) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            // In a real app, we would send this to the server
            const newPost = {
                id: 'lft' + Date.now(),
                userId: this.currentUser.id,
                title: this.lftForm.title,
                rank: this.lftForm.rank,
                role: this.lftForm.role,
                agents: [...this.lftForm.agents],
                language: this.lftForm.language,
                availability: this.lftForm.availability,
                description: this.lftForm.description,
                createdAt: new Date(),
                active: true,
                discord: this.currentUser.discord,
                username: this.currentUser.username
            };
            
            // Add to lists
            this.players.unshift(newPost);
            this.myLftPosts.unshift(newPost);
            
            // For demo purposes
            if (this.recentPlayers.length >= 3) {
                this.recentPlayers.pop();
            }
            this.recentPlayers.unshift(newPost);
            
            // Reset form
            this.lftForm = {
                title: '',
                rank: '',
                role: '',
                agents: [],
                language: 'Français',
                availability: '',
                description: ''
            };
            
            this.showCreateLftModal = false;
            this.userStats.postsCount++;
            
            alert('Annonce LFT créée avec succès');
        },
        createLfpPost() {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Validate form
            if (!this.lfpForm.teamName || !this.lfpForm.level || !this.lfpForm.roleNeeded || !this.lfpForm.description) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            // In a real app, we would send this to the server
            const newPost = {
                id: 'lfp' + Date.now(),
                userId: this.currentUser.id,
                name: this.lfpForm.teamName,
                teamName: this.lfpForm.teamName,
                level: this.lfpForm.level,
                roleNeeded: this.lfpForm.roleNeeded,
                minRank: this.lfpForm.minRank,
                language: this.lfpForm.language,
                practiceSchedule: this.lfpForm.practiceSchedule,
                description: this.lfpForm.description,
                createdAt: new Date(),
                active: true,
                discord: this.currentUser.discord
            };
            
            // Add to lists
            this.teams.unshift(newPost);
            this.myLfpPosts.unshift(newPost);
            
            // For demo purposes
            if (this.recentTeams.length >= 3) {
                this.recentTeams.pop();
            }
            this.recentTeams.unshift(newPost);
            
            // Reset form
            this.lfpForm = {
                teamName: '',
                level: '',
                roleNeeded: '',
                minRank: '',
                language: 'Français',
                practiceSchedule: '',
                description: ''
            };
            
            this.showCreateLfpModal = false;
            this.userStats.postsCount++;
            
            alert('Annonce LFP créée avec succès');
        },
        createScrim() {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Validate form
            if (!this.scrimForm.teamName || !this.scrimForm.date || !this.scrimForm.time || !this.scrimForm.level) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            // In a real app, we would send this to the server
            const newScrim = {
                id: 'scrim' + Date.now(),
                userId: this.currentUser.id,
                teamName: this.scrimForm.teamName,
                date: this.scrimForm.date,
                time: this.scrimForm.time,
                level: this.scrimForm.level,
                format: this.scrimForm.format,
                description: this.scrimForm.description,
                status: 'available',
                createdAt: new Date(),
                discord: this.currentUser.discord
            };
            
            // Add to lists
            this.scrims.unshift(newScrim);
            this.myScrims.unshift(newScrim);
            
            // Reset form
            this.scrimForm = {
                teamName: '',
                date: this.formatDateForInput(new Date()),
                time: '19:00',
                level: '',
                format: 'BO1',
                description: ''
            };
            
            this.showCreateScrimModal = false;
            this.userStats.postsCount++;
            
            alert('Proposition de scrim créée avec succès');
        },
        createGroup() {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Validate form
            if (!this.groupForm.rank || !this.groupForm.playersNeeded || !this.groupForm.gameMode) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            // In a real app, we would send this to the server
            const newGroup = {
                id: 'group' + Date.now(),
                userId: this.currentUser.id,
                rank: this.groupForm.rank,
                playersNeeded: parseInt(this.groupForm.playersNeeded),
                currentSize: 5 - parseInt(this.groupForm.playersNeeded),
                gameMode: this.groupForm.gameMode,
                language: this.groupForm.language,
                availability: this.groupForm.availability,
                description: this.groupForm.description,
                createdAt: new Date(),
                active: true,
                discord: this.currentUser.discord,
                members: [
                    {
                        id: this.currentUser.id,
                        username: this.currentUser.username,
                        role: this.currentUser.role
                    }
                ]
            };
            
            // Add to lists
            this.groups.unshift(newGroup);
            this.myGroups.unshift(newGroup);
            
            // Reset form
            this.groupForm = {
                rank: '',
                playersNeeded: '1',
                gameMode: 'Competitive',
                language: 'Français',
                availability: '',
                description: ''
            };
            
            this.showCreateGroupModal = false;
            this.userStats.postsCount++;
            
            alert('Groupe créé avec succès');
        },
        bookScrim(id) {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Find the scrim in both global and user lists
            const scrimIndex = this.scrims.findIndex(s => s.id === id);
            const myScrimIndex = this.myScrims.findIndex(s => s.id === id);
            
            if (scrimIndex !== -1) {
                // Check if it's the user's own scrim
                if (this.scrims[scrimIndex].userId === this.currentUser.id) {
                    alert('Vous ne pouvez pas réserver votre propre scrim');
                    return;
                }
                
                // Update the scrim
                this.scrims[scrimIndex].status = 'booked';
                this.scrims[scrimIndex].bookedBy = this.currentUser.username;
                
                alert('Scrim réservé avec succès');
            }
        },
        cancelScrimBooking(id) {
            // Find the scrim in both global and user lists
            const scrimIndex = this.scrims.findIndex(s => s.id === id);
            const myScrimIndex = this.myScrims.findIndex(s => s.id === id);
            
            if (myScrimIndex !== -1) {
                // Update the scrim
                this.myScrims[myScrimIndex].status = 'available';
                delete this.myScrims[myScrimIndex].bookedBy;
                
                // Also update the global list if found
                if (scrimIndex !== -1) {
                    this.scrims[scrimIndex].status = 'available';
                    delete this.scrims[scrimIndex].bookedBy;
                }
                
                alert('Réservation annulée avec succès');
            }
        },
        joinGroup(id) {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
                return;
            }
            
            // Find the group
            const groupIndex = this.groups.findIndex(g => g.id === id);
            
            if (groupIndex !== -1) {
                const group = this.groups[groupIndex];
                
                // Check if already a member
                if (group.members.some(m => m.id === this.currentUser.id)) {
                    alert('Vous êtes déjà membre de ce groupe');
                    return;
                }
                
                // Check if group is full
                if (group.playersNeeded <= 0) {
                    alert('Ce groupe est déjà complet');
                    return;
                }
                
                // Add user to group
                group.members.push({
                    id: this.currentUser.id,
                    username: this.currentUser.username,
                    role: this.currentUser.role
                });
                
                // Update counts
                group.playersNeeded--;
                group.currentSize++;
                
                alert('Vous avez rejoint le groupe avec succès');
            }
        },
        removeMember(groupId, memberId) {
            // Find the group in user's groups
            const groupIndex = this.myGroups.findIndex(g => g.id === groupId);
            
            if (groupIndex !== -1) {
                const group = this.myGroups[groupIndex];
                
                // Find the member index
                const memberIndex = group.members.findIndex(m => m.id === memberId);
                
                if (memberIndex !== -1) {
                    // Remove the member
                    group.members.splice(memberIndex, 1);
                    group.playersNeeded++;
                    group.currentSize--;
                    
                    // Also update the global list if found
                    const globalGroupIndex = this.groups.findIndex(g => g.id === groupId);
                    if (globalGroupIndex !== -1) {
                        const globalGroup = this.groups[globalGroupIndex];
                        const globalMemberIndex = globalGroup.members.findIndex(m => m.id === memberId);
                        
                        if (globalMemberIndex !== -1) {
                            globalGroup.members.splice(globalMemberIndex, 1);
                            globalGroup.playersNeeded++;
                            globalGroup.currentSize--;
                        }
                    }
                    
                    alert('Membre retiré du groupe avec succès');
                }
            }
        },
        togglePostStatus(id, type) {
            let postList, globalList;
            
            // Determine which lists to update based on type
            switch (type) {
                case 'lft':
                    postList = this.myLftPosts;
                    globalList = this.players;
                    break;
                case 'lfp':
                    postList = this.myLfpPosts;
                    globalList = this.teams;
                    break;
                case 'groups':
                    postList = this.myGroups;
                    globalList = this.groups;
                    break;
                default:
                    return;
            }
            
            // Find the post in user's list
            const postIndex = postList.findIndex(p => p.id === id);
            
            if (postIndex !== -1) {
                // Toggle active status
                postList[postIndex].active = !postList[postIndex].active;
                
                // Also update the global list if found
                const globalIndex = globalList.findIndex(p => p.id === id);
                if (globalIndex !== -1) {
                    globalList[globalIndex].active = postList[postIndex].active;
                }
                
                alert(`Annonce ${postList[postIndex].active ? 'activée' : 'désactivée'} avec succès`);
            }
        },
        deletePost(id, type) {
            let postList, globalList;
            
            // Determine which lists to update based on type
            switch (type) {
                case 'lft':
                    postList = this.myLftPosts;
                    globalList = this.players;
                    break;
                case 'lfp':
                    postList = this.myLfpPosts;
                    globalList = this.teams;
                    break;
                case 'scrims':
                    postList = this.myScrims;
                    globalList = this.scrims;
                    break;
                case 'groups':
                    postList = this.myGroups;
                    globalList = this.groups;
                    break;
                default:
                    return;
            }
            
            // Find the post in user's list
            const postIndex = postList.findIndex(p => p.id === id);
            
            if (postIndex !== -1) {
                // Remove from user's list
                postList.splice(postIndex, 1);
                
                // Also remove from the global list if found
                const globalIndex = globalList.findIndex(p => p.id === id);
                if (globalIndex !== -1) {
                    globalList.splice(globalIndex, 1);
                }
                
                // Also check recent lists
                if (type === 'lft') {
                    const recentIndex = this.recentPlayers.findIndex(p => p.id === id);
                    if (recentIndex !== -1) {
                        this.recentPlayers.splice(recentIndex, 1);
                    }
                } else if (type === 'lfp') {
                    const recentIndex = this.recentTeams.findIndex(p => p.id === id);
                    if (recentIndex !== -1) {
                        this.recentTeams.splice(recentIndex, 1);
                    }
                }
                
                this.userStats.postsCount = Math.max(0, this.userStats.postsCount - 1);
                alert('Annonce supprimée avec succès');
            }
        },
        editLftPost(id) {
            const post = this.myLftPosts.find(p => p.id === id);
            if (post) {
                this.lftForm = {
                    title: post.title,
                    rank: post.rank,
                    role: post.role,
                    agents: [...post.agents],
                    language: post.language,
                    availability: post.availability,
                    description: post.description
                };
                
                // Delete the old post
                this.deletePost(id, 'lft');
                
                // Show modal to create new post with existing data
                this.showCreateLftModal = true;
            }
        },
        editLfpPost(id) {
            const post = this.myLfpPosts.find(p => p.id === id);
            if (post) {
                this.lfpForm = {
                    teamName: post.teamName,
                    level: post.level,
                    roleNeeded: post.roleNeeded,
                    minRank: post.minRank,
                    language: post.language,
                    practiceSchedule: post.practiceSchedule,
                    description: post.description
                };
                
                // Delete the old post
                this.deletePost(id, 'lfp');
                
                // Show modal to create new post with existing data
                this.showCreateLfpModal = true;
            }
        },
        editScrim(id) {
            const scrim = this.myScrims.find(s => s.id === id);
            if (scrim) {
                this.scrimForm = {
                    teamName: scrim.teamName,
                    date: scrim.date,
                    time: scrim.time,
                    level: scrim.level,
                    format: scrim.format,
                    description: scrim.description
                };
                
                // Delete the old post
                this.deletePost(id, 'scrims');
                
                // Show modal to create new post with existing data
                this.showCreateScrimModal = true;
            }
        },
        editGroup(id) {
            const group = this.myGroups.find(g => g.id === id);
            if (group) {
                this.groupForm = {
                    rank: group.rank,
                    playersNeeded: group.playersNeeded.toString(),
                    gameMode: group.gameMode,
                    language: group.language,
                    availability: group.availability,
                    description: group.description
                };
                
                // Delete the old post
                this.deletePost(id, 'groups');
                
                // Show modal to create new post with existing data
                this.showCreateGroupModal = true;
            }
        },
        
        // Data Loading
        async loadInitialData() {
            try {
                this.isLoading = true;
                
                // In a real app, these would be API calls to get real data
                // For now, we're just initializing empty arrays
                this.players = [];
                this.teams = [];
                this.scrims = [];
                this.groups = [];
                
                // Attempt to load admin user (QMD France) data for display purposes
                await this.fetchUserData('admin1');
                
                this.isLoading = false;
            } catch (error) {
                console.error('Error loading initial data:', error);
                this.error = 'Erreur lors du chargement des données';
                this.isLoading = false;
            }
        },
        
        async loadUserContent() {
            try {
                this.isLoading = true;
                
                // In a real app, these would be API calls filtered by the current user's ID
                // For now we're just initializing empty arrays
                this.myLftPosts = [];
                this.myLfpPosts = [];
                this.myScrims = [];
                this.myGroups = [];
                
                this.isLoading = false;
            } catch (error) {
                console.error('Error loading user content:', error);
                this.error = 'Erreur lors du chargement de vos données';
                this.isLoading = false;
            }
        },
        
        async fetchUserData(userId) {
            try {
                // In a real app, this would fetch from a server API
                // For now, we simulate getting the admin user from the static users.json
                if (userId === 'admin1') {
                    return {
                        id: 'admin1',
                        username: 'QMD France',
                        isOfficial: true,
                        rank: 'Radiant',
                        role: 'Flex',
                        agents: ['Jett', 'Reyna', 'Sage', 'Omen', 'Sova'],
                        discord: 'QMDFrance#0001',
                        about: 'Compte officiel QMD Esport France',
                        availability: 'Disponible pour des questions sur le Discord'
                    };
                }
                return null;
            } catch (error) {
                console.error('Error fetching user data:', error);
                throw error;
            }
        },
        
        getRandomSubarray(arr, size) {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, size);
        }
    },
    mounted() {
        this.loadInitialData();
    }
});

app.mount('#app');