#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 AUTOMATED SECRET ROTATION SCRIPT${NC}\n"

# Define all secrets to rotate
declare -A SECRETS=(
    ["FIREBASE_API_KEY"]="Firebase API Key"
    ["OPENROUTER_API_KEY"]="OpenRouter API Key"
    ["SLACK_BOT_TOKEN"]="Slack Bot Token"
)

declare -A OLD_VALUES=(
    ["FIREBASE_API_KEY"]="[REDACTED_FIREBASE_KEY]"
    ["OPENROUTER_API_KEY"]="[REDACTED_OPENROUTER_KEY]"
    ["SLACK_BOT_TOKEN"]="[REDACTED_SLACK_TOKEN]"
)

declare -A LOCATIONS=(
    ["FIREBASE_API_KEY"]="/Users/MacAttack/Projects/job-hunt-frontend/.env.local"
    ["OPENROUTER_API_KEY"]="/Users/MacAttack/Projects/job-hunt-frontend/.env.local /Volumes/Crucial\ X9\ Pro\ For\ Mac/Library/OpenBrain/.env"
    ["SLACK_BOT_TOKEN"]="/Volumes/Crucial\ X9\ Pro\ For\ Mac/Library/OpenBrain/.env"
)

# Create backup
BACKUP_DIR="/Users/MacAttack/Projects/job-hunt-frontend/secret-rotation-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📦 Creating backups...${NC}"
cp /Users/MacAttack/Projects/job-hunt-frontend/.env.local "$BACKUP_DIR/"
cp "/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/.env" "$BACKUP_DIR/"
echo -e "${GREEN}✓ Backups created in $BACKUP_DIR${NC}\n"

# Process each secret
for SECRET_KEY in "${!SECRETS[@]}"; do
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}${SECRETS[$SECRET_KEY]}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    OLD_VAL="${OLD_VALUES[$SECRET_KEY]}"
    echo -e "Old value: ${RED}${OLD_VAL:0:20}...${NC}"
    
    # Prompt for new value
    read -p "Enter new ${SECRETS[$SECRET_KEY]}: " NEW_VAL
    
    if [ -z "$NEW_VAL" ]; then
        echo -e "${YELLOW}⊘ Skipping ${SECRETS[$SECRET_KEY]}${NC}\n"
        continue
    fi
    
    echo -e "New value: ${GREEN}${NEW_VAL:0:20}...${NC}"
    
    # Replace in all locations
    LOCS="${LOCATIONS[$SECRET_KEY]}"
    COUNT=0
    
    for FILE in $LOCS; do
        if [ -f "$FILE" ]; then
            # Count occurrences
            OCCURRENCES=$(grep -c "$OLD_VAL" "$FILE" || echo "0")
            if [ "$OCCURRENCES" -gt 0 ]; then
                sed -i "" "s|$OLD_VAL|$NEW_VAL|g" "$FILE"
                COUNT=$((COUNT + OCCURRENCES))
                echo -e "  ✓ Updated $FILE ($OCCURRENCES occurrences)"
            fi
        fi
    done
    
    if [ $COUNT -gt 0 ]; then
        echo -e "${GREEN}✓ Replaced ${SECRETS[$SECRET_KEY]} in $COUNT locations${NC}\n"
    else
        echo -e "${YELLOW}⊘ No occurrences found for ${SECRETS[$SECRET_KEY]}${NC}\n"
    fi
done

# Verify changes
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔍 Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "job-hunt-frontend/.env.local:"
grep -E "FIREBASE_API_KEY|OPENROUTER_API_KEY" /Users/MacAttack/Projects/job-hunt-frontend/.env.local | head -2

echo -e "\nOpenBrain/.env:"
grep -E "OPENROUTER_API_KEY|SLACK_BOT_TOKEN|MCP_ACCESS_KEY" "/Volumes/Crucial X9 Pro For Mac/Library/OpenBrain/.env" | head -3

echo -e "\n${GREEN}✅ Secret rotation complete!${NC}"
echo -e "${YELLOW}Backup location: $BACKUP_DIR${NC}\n"
